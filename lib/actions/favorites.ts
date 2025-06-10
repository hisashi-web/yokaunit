import { supabase } from "@/lib/supabase"

export async function toggleFavorite(toolSlug: string): Promise<{ success: boolean; isFavorited: boolean }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("ログインが必要です")
    }

    // 既存のお気に入りをチェック
    const { data: existingFavorite, error: checkError } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_slug", toolSlug)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existingFavorite) {
      // お気に入りを削除
      const { error: deleteError } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("tool_slug", toolSlug)

      if (deleteError) {
        throw deleteError
      }

      return { success: true, isFavorited: false }
    } else {
      // お気に入りを追加
      const { error: insertError } = await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, tool_slug: toolSlug })

      if (insertError) {
        throw insertError
      }

      return { success: true, isFavorited: true }
    }
  } catch (error) {
    console.error("お気に入り切り替えエラー:", error)
    return { success: false, isFavorited: false }
  }
}

export async function getUserFavorites(): Promise<string[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase.from("user_favorites").select("tool_slug").eq("user_id", user.id)

    if (error) {
      throw error
    }

    return data.map((fav) => fav.tool_slug)
  } catch (error) {
    console.error("お気に入り取得エラー:", error)
    return []
  }
}
