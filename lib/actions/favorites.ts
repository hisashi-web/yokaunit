"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getUserFavorites(): Promise<string[]> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) {
      return []
    }

    const userId = session.session.user.id

    const { data, error } = await supabase.from("user_favorites").select("tool_slug").eq("user_id", userId)

    if (error) {
      console.error("Error fetching favorites:", error)
      return []
    }

    return data.map((item) => item.tool_slug)
  } catch (error) {
    console.error("Error in getUserFavorites:", error)
    return []
  }
}

export async function toggleFavorite(toolSlug: string): Promise<{ success: boolean; isFavorited: boolean }> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) {
      throw new Error("ログインが必要です")
    }

    const userId = session.session.user.id

    // 現在のお気に入り状態を確認
    const { data: existingFavorite, error: checkError } = await supabase
      .from("user_favorites")
      .select()
      .eq("user_id", userId)
      .eq("tool_slug", toolSlug)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking favorite status:", checkError)
      throw new Error("お気に入りの確認に失敗しました")
    }

    let isFavorited = false

    if (existingFavorite) {
      // お気に入りから削除
      const { error: deleteError } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("tool_slug", toolSlug)

      if (deleteError) {
        console.error("Error removing favorite:", deleteError)
        throw new Error("お気に入りの削除に失敗しました")
      }

      // いいね数を減らす
      const { error: updateError } = await supabase.rpc("decrement_likes", {
        slug_to_update: toolSlug,
      })

      if (updateError) {
        console.error("Error decrementing likes:", updateError)
      }

      isFavorited = false
    } else {
      // お気に入りに追加
      const { error: insertError } = await supabase.from("user_favorites").insert({
        user_id: userId,
        tool_slug: toolSlug,
      })

      if (insertError) {
        console.error("Error adding favorite:", insertError)
        throw new Error("お気に入りの追加に失敗しました")
      }

      // いいね数を増やす
      const { error: updateError } = await supabase.rpc("increment_likes", {
        slug_to_update: toolSlug,
      })

      if (updateError) {
        console.error("Error incrementing likes:", updateError)
      }

      isFavorited = true
    }

    // キャッシュを更新
    revalidatePath("/tools")
    revalidatePath("/")
    revalidatePath("/account")
    revalidatePath("/account/favorites")

    return { success: true, isFavorited }
  } catch (error) {
    console.error("Error in toggleFavorite:", error)
    throw error
  }
}
