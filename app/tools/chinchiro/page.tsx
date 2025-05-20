"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, RigidBody } from "@react-three/rapier"
import { Environment, OrbitControls, Text, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dice1Icon as DiceIcon,
  History,
  HelpCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-mobile"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Head from "next/head"

// カメラコントロールコンポーネント
function CameraControls({ zoomIn, zoomOut, resetCamera, isMobile }) {
  const { camera } = useThree()

  useEffect(() => {
    // 初期カメラ位置を設定
    if (isMobile) {
      camera.position.set(0, 9, 14)
    } else {
      camera.position.set(0, 8, 12)
    }
    camera.updateProjectionMatrix()
  }, [camera, isMobile])

  // ズームイン関数を修正
  useEffect(() => {
    // zoomIn関数を上書き
    window.zoomInCamera = () => {
      camera.position.y *= 0.8
      camera.position.z *= 0.8
      camera.updateProjectionMatrix()
    }

    // zoomOut関数を上書き
    window.zoomOutCamera = () => {
      camera.position.y *= 1.2
      camera.position.z *= 1.2
      camera.updateProjectionMatrix()
    }

    // resetCamera関数を上書き
    window.resetCameraPosition = () => {
      if (isMobile) {
        camera.position.set(0, 9, 14)
      } else {
        camera.position.set(0, 8, 12)
      }
      camera.updateProjectionMatrix()
    }

    return () => {
      window.zoomInCamera = undefined
      window.zoomOutCamera = undefined
      window.resetCameraPosition = undefined
    }
  }, [camera, isMobile])

  return <OrbitControls enablePan={false} enableZoom={true} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.5} />
}

// パンくずリストコンポーネント
function Breadcrumbs({ items }) {
  return (
    <nav className="flex" aria-label="パンくずリスト">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
            {index === items.length - 1 ? (
              <span className="text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// サイコロの面の配置（向かい合う面の合計が7になる）
const faceRotations = [
  [0, 0, 0], // 1の面（上）
  [0, 0, Math.PI / 2], // 2の面（右）
  [Math.PI / 2, 0, 0], // 3の面（前）
  [-Math.PI / 2, 0, 0], // 4の面（後）
  [0, 0, -Math.PI / 2], // 5の面（左）
  [Math.PI, 0, 0], // 6の面（下）
]

// サイコロの面に数字を表示するコンポーネント
function DiceFace({ position, rotation, number, size }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, size / 2 + 0.001]}>
        <planeGeometry args={[size * 0.8, size * 0.8]} />
        <meshBasicMaterial transparent opacity={0} />
        <Text position={[0, 0, 0.001]} fontSize={size * 0.5} color="#000000" anchorX="center" anchorY="middle">
          {number}
        </Text>
      </mesh>
    </group>
  )
}

// 机コンポーネント
function Table() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[30, 1, 30]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </RigidBody>
  )
}

// 器コンポーネント
function Bowl() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[8, 1, 8]} />
        <meshStandardMaterial color="#E6B17E" />
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[7.5, 1, 7.5]} />
          <meshStandardMaterial color="#F7D9B5" />
        </mesh>
      </mesh>
    </RigidBody>
  )
}

// 壁のコンポーネント
function Walls() {
  return (
    <>
      {/* 左の壁 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-4, 0, 0]} receiveShadow>
          <boxGeometry args={[0.5, 2, 8]} />
          <meshStandardMaterial color="#D4A76A" transparent opacity={0.7} />
        </mesh>
      </RigidBody>

      {/* 右の壁 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[4, 0, 0]} receiveShadow>
          <boxGeometry args={[0.5, 2, 8]} />
          <meshStandardMaterial color="#D4A76A" transparent opacity={0.7} />
        </mesh>
      </RigidBody>

      {/* 奥の壁 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0, -4]} receiveShadow>
          <boxGeometry args={[8, 2, 0.5]} />
          <meshStandardMaterial color="#D4A76A" transparent opacity={0.7} />
        </mesh>
      </RigidBody>

      {/* 手前の壁 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0, 4]} receiveShadow>
          <boxGeometry args={[8, 2, 0.5]} />
          <meshStandardMaterial color="#D4A76A" transparent opacity={0.7} />
        </mesh>
      </RigidBody>
    </>
  )
}

// サイコロコンポーネント
function Dice({
  index,
  position,
  rolling,
  onRest,
  color = "#ffffff",
  resetPosition,
  continueFromCurrent,
  rollTrigger,
}) {
  const rigidBodyRef = useRef(null)
  const [rested, setRested] = useState(false)
  const [topFace, setTopFace] = useState(1)
  const size = 0.8 // サイコロのサイズ

  // 初期位置を器の上に設定
  const initialPosition = [
    position[0],
    0.5, // 器の上に配置
    position[2],
  ]

  // 初期の力と回転を調整（より自然な動きに）
  // useRefではなく通常の変数として定義（毎回新しい値を生成するため）
  const getRandomImpulse = () => [
    Math.random() * 2 - 1, // X方向の力をランダム
    Math.random() * 3 + 4, // Y方向の力を適度に
    Math.random() * 2 - 1, // Z方向の力をランダム
  ]

  const getRandomTorque = () => [
    (Math.random() - 0.5) * 1.5, // X: 回転をランダムに
    (Math.random() - 0.5) * 1.5, // Y: 回転をランダムに
    (Math.random() - 0.5) * 1.5, // Z: 回転をランダムに
  ]

  // サイコロの上面を判定する関数
  const determineTopFace = () => {
    if (!rigidBodyRef.current) return 1

    const q = rigidBodyRef.current.rotation() // Quaternion

    // 四元数→ 回転行列
    const rotMatrix = [
      [1 - 2 * (q.y * q.y + q.z * q.z), 2 * (q.x * q.y - q.z * q.w), 2 * (q.x * q.z + q.y * q.w)],
      [2 * (q.x * q.y + q.z * q.w), 1 - 2 * (q.x * q.x + q.z * q.z), 2 * (q.y * q.z - q.x * q.w)],
      [2 * (q.x * q.z - q.y * q.w), 2 * (q.y * q.z + q.x * q.w), 1 - 2 * (q.x * q.x + q.y * q.y)],
    ]

    // 各面の法線ベクトル（初期状態での方向）
    const normals = [
      { face: 4, normal: [0, 1, 0] }, // 上面 → DiceFace: face 4
      { face: 2, normal: [1, 0, 0] }, // 右面 → DiceFace: face 2
      { face: 1, normal: [0, 0, 1] }, // 前面 → DiceFace: face 1
      { face: 6, normal: [0, 0, -1] }, // 後面 → DiceFace: face 6
      { face: 5, normal: [-1, 0, 0] }, // 左面 → DiceFace: face 5
      { face: 3, normal: [0, -1, 0] }, // 下面 → DiceFace: face 3
    ]

    let maxDot = Number.NEGATIVE_INFINITY
    let topFace = 1

    normals.forEach(({ face, normal }) => {
      // normal ベクトルに回転行列を掛ける（回転させる）
      const rotated = {
        x: rotMatrix[0][0] * normal[0] + rotMatrix[0][1] * normal[1] + rotMatrix[0][2] * normal[2],
        y: rotMatrix[1][0] * normal[0] + rotMatrix[1][1] * normal[1] + rotMatrix[1][2] * normal[2],
        z: rotMatrix[2][0] * normal[0] + rotMatrix[2][1] * normal[1] + rotMatrix[2][2] * normal[2],
      }

      //上方向(Y軸正方向)との内積を見る
      const dot = rotated.y

      if (dot > maxDot) {
        maxDot = dot
        topFace = face
      }
    })

    return topFace
  }

  // サイコロが器の外に出たかチェック
  const isOutOfBowl = () => {
    if (!rigidBodyRef.current) return false

    const position = rigidBodyRef.current.translation()
    // 器の範囲を定義（中心が(0, -0.5, 0)で、サイズが(8, 1, 8)の箱）
    const bowlMinX = -3.5
    const bowlMaxX = 3.5
    const bowlMinZ = -3.5
    const bowlMaxZ = 3.5
    const bowlMinY = -1.0 // 器の底面より少し下

    return (
      position.x < bowlMinX ||
      position.x > bowlMaxX ||
      position.z < bowlMinZ ||
      position.z > bowlMaxZ ||
      position.y < bowlMinY
    )
  }

  // リセットボタンが押された時の処理
  useEffect(() => {
    if (resetPosition && rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation({
        x: initialPosition[0],
        y: 0.5,
        z: initialPosition[2],
      })
      rigidBodyRef.current.setRotation({ x: Math.random(), y: Math.random(), z: Math.random(), w: Math.random() })
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 })
      setRested(false)
    }
  }, [resetPosition])

  // サイコロを振る処理 - rollTriggerの変更を監視して実行
  useEffect(() => {
    if (rolling && rigidBodyRef.current) {
      // 現在位置からさらに回す場合は位置をリセットしない
      if (!continueFromCurrent) {
        // サイコロを初期位置にリセット
        rigidBodyRef.current.setTranslation({
          x: initialPosition[0],
          y: 0.5,
          z: initialPosition[2],
        })
        rigidBodyRef.current.setRotation({ x: Math.random(), y: Math.random(), z: Math.random(), w: Math.random() })
      } else {
        // 現在位置から回す場合でも、少し持ち上げて確実に動くようにする
        const currentPos = rigidBodyRef.current.translation()
        rigidBodyRef.current.setTranslation({
          x: currentPos.x,
          y: currentPos.y + 0.1, // 少し持ち上げる
          z: currentPos.z,
        })
      }

      // 速度と角速度をリセット - これは常に行う
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 })

      // 力と回転を適用
      setTimeout(() => {
        if (rigidBodyRef.current) {
          // 毎回新しいランダム値を生成
          const impulse = getRandomImpulse()
          const torque = getRandomTorque()

          rigidBodyRef.current.applyImpulse({
            x: impulse[0],
            y: impulse[1],
            z: impulse[2],
          })
          rigidBodyRef.current.applyTorqueImpulse({
            x: torque[0],
            y: torque[1],
            z: torque[2],
          })
        }
      }, 10)

      setRested(false)
    }
  }, [rollTrigger]) // rollingではなくrollTriggerを監視

  // サイコロが止まったかどうかを検出
  useFrame(() => {
    if (rolling && !rested && rigidBodyRef.current) {
      const vel = rigidBodyRef.current.linvel()
      const angVel = rigidBodyRef.current.angvel()

      const isResting =
        Math.abs(vel.x) < 0.05 &&
        Math.abs(vel.y) < 0.05 &&
        Math.abs(vel.z) < 0.05 &&
        Math.abs(angVel.x) < 0.05 &&
        Math.abs(angVel.y) < 0.05 &&
        Math.abs(angVel.z) < 0.05

      if (isResting) {
        const face = determineTopFace()
        setTopFace(face)
        setRested(true)

        // サイコロが器の外に出たかチェック
        const outOfBowl = isOutOfBowl()
        onRest(index, face, outOfBowl)
      }
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      restitution={0.1} // 反発係数を下げる
      friction={0.8} // 摩擦を上げる
      mass={10} // 質量を増やす
      position={initialPosition} // 初期位置を設定
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} />

        {/* サイコロの各面に数字を表示 */}
        <DiceFace position={[0, 0, 0]} rotation={[0, 0, 0]} number="1" size={size} />
        <DiceFace position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} number="2" size={size} />
        <DiceFace position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} number="3" size={size} />
        <DiceFace position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} number="4" size={size} />
        <DiceFace position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} number="5" size={size} />
        <DiceFace position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} number="6" size={size} />
      </mesh>
    </RigidBody>
  )
}

// 結果表示コンポーネント
function ResultDisplay({ result, resultClass }) {
  if (!result) return null

  // しょんべんの場合は特別な表示
  if (result.includes("しょんべん")) {
    return (
      <div className="flex flex-col items-center">
        <div className={`text-xl ${resultClass} font-medium py-2 px-4 rounded-full bg-gray-50 shadow-sm`}>
          しょんべん！
        </div>
        <div className="text-xs text-gray-500 mt-1">（サイコロが器から出ました）</div>
      </div>
    )
  }

  return (
    <div className={`text-xl ${resultClass} font-medium py-2 px-4 rounded-full bg-gray-50 shadow-sm`}>{result}</div>
  )
}

// チンチロゲームのメインコンポーネント
export default function ChinchiroPage() {
  const [rolling, setRolling] = useState(false)
  const [diceValues, setDiceValues] = useState([1, 1, 1])
  const [diceOutOfBowl, setDiceOutOfBowl] = useState([false, false, false])
  const [result, setResult] = useState("")
  const [resultClass, setResultClass] = useState("")
  const [history, setHistory] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [allDiceStopped, setAllDiceStopped] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0) // リセットボタン用のトリガー
  const [rollTrigger, setRollTrigger] = useState(0) // サイコロを振るたびに増加するトリガー
  const [continueMode, setContinueMode] = useState(false) // 現在位置から続けるモード
  const [cameraPosition, setCameraPosition] = useState([0, 8, 12]) // カメラ位置の初期値
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  // サイコロの音声
  const rollSound = useRef(null)
  const winSound = useRef(null)
  const loseSound = useRef(null)

  /* 音声ファイルが存在しないためコメントアウト
  useEffect(() => {
    // 音声の初期化を試みる
    try {
      rollSound.current = new Audio("/sounds/dice-roll.mp3")
      winSound.current = new Audio("/sounds/win.mp3")
      loseSound.current = new Audio("/sounds/lose.mp3")
    } catch (error) {
      console.error("音声の初期化に失敗しました:", error)
    }

    return () => {
      // クリーンアップ
      rollSound.current = null
      winSound.current = null
      loseSound.current = null
    }
  }, [])
  */

  // モバイルの場合はカメラ位置を調整
  useEffect(() => {
    if (isMobile) {
      setCameraPosition([0, 9, 14]) // モバイルではより遠くから見る
    } else {
      setCameraPosition([0, 8, 12]) // デスクトップの場合
    }
  }, [isMobile])

  // カメラをズームイン
  const zoomIn = () => {
    if (window.zoomInCamera) {
      window.zoomInCamera()
    }
  }

  // カメラをズームアウト
  const zoomOut = () => {
    if (window.zoomOutCamera) {
      window.zoomOutCamera()
    }
  }

  // カメラをリセット
  const resetCamera = () => {
    if (window.resetCameraPosition) {
      window.resetCameraPosition()
    }
  }

  // サイコロを振る
  const rollDice = () => {
    setRolling(true)
    setResult("")
    setResultClass("")
    setAllDiceStopped(false)
    setDiceOutOfBowl([false, false, false])
    setRollTrigger((prev) => prev + 1) // rollTriggerを更新して子コンポーネントのuseEffectを発火

    /* 音声ファイルが存在しないためコメントアウト
    // サイコロを振る音声を再生
    if (soundEnabled && rollSound.current) {
      try {
        rollSound.current.currentTime = 0
        rollSound.current.play().catch((e) => console.error("音声再生エラー:", e))
      } catch (error) {
        console.error("音声再生に失敗しました:", error)
      }
    }
    */

    // 新しい値の配列を初期化
    const newValues = [0, 0, 0]
    setDiceValues(newValues)

    // 最大10秒後に強制的に結果を表示（サイコロが永久に回り続けるのを防止）
    setTimeout(() => {
      if (rolling && !allDiceStopped) {
        const randomValues = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]
        setDiceValues(randomValues)
        handleAllDiceStopped(randomValues, [false, false, false])
      }
    }, 10000)
  }

  // リセットボタンの処理
  const resetDice = () => {
    setRolling(false)
    setAllDiceStopped(false)
    setResetTrigger((prev) => prev + 1) // トリガーを更新して子コンポーネントのuseEffectを発火
  }

  // サイコロが止まった時のコールバック
  const handleDiceRest = (index, value, outOfBowl) => {
    // 値を更新
    setDiceValues((prev) => {
      const newValues = [...prev]
      newValues[index] = value
      return newValues
    })

    // 器から出たかどうかを更新
    setDiceOutOfBowl((prev) => {
      const newOutOfBowl = [...prev]
      newOutOfBowl[index] = outOfBowl
      return newOutOfBowl
    })

    // すべてのサイコロが止まったかチェック
    setDiceValues((prevValues) => {
      setDiceOutOfBowl((prevOutOfBowl) => {
        const allStopped = prevValues.every((v) => v !== 0)

        if (allStopped) {
          handleAllDiceStopped(prevValues, prevOutOfBowl)
        }

        return prevOutOfBowl
      })

      return prevValues
    })
  }

  // すべてのサイコロが止まった時の処理
  const handleAllDiceStopped = (values, outOfBowl) => {
    if (allDiceStopped) return // 既に処理済みなら何もしない

    setAllDiceStopped(true)

    // 結果を判定
    const result = determineResult(values, outOfBowl)
    setResult(result.message)
    setResultClass(result.class)

    // 履歴に追加
    const historyItem = {
      id: Date.now(),
      values: [...values],
      outOfBowl: [...outOfBowl],
      result: result.message,
    }
    setHistory((prev) => [historyItem, ...prev].slice(0, 10))

    /* 音声ファイルが現在ないためコメントアウト
    // 音声再生
    if (soundEnabled) {
      try {
        if (result.win) {
          winSound.current.currentTime = 0
          winSound.current.play().catch((e) => console.error("音声再生エラー:", e))
        } else {
          loseSound.current.currentTime = 0
          loseSound.current.play().catch((e) => console.error("音声再生エラー:", e))
        }
      } catch (error) {
        console.error("音声再生に失敗しました:", error)
      }
    }
    */

    // トースト通知
    if (result.win) {
      toast({
        title: "勝利！",
        description: `${result.message}`,
        variant: "default",
      })
    } else {
      toast({
        title: "残念...",
        description: `${result.message}`,
        variant: "destructive",
      })
    }

    // ローリング状態を解除
    setTimeout(() => {
      setRolling(false)
    }, 500)
  }

  // 結果の判定
  const determineResult = (values, outOfBowl) => {
    // サイコロが器から出ていないか確認
    if (outOfBowl.some((out) => out)) {
      return { message: "しょんべん！（サイコロが器から出ました）", win: false, class: "text-gray-500" }
    }

    // ソートして判定しやすくする
    const sorted = [...values].sort()

    // ピンゾロ (1, 1, 1)
    if (sorted[0] === 1 && sorted[1] === 1 && sorted[2] === 1) {
      return { message: "ピンゾロ！", win: true, class: "text-red-500 font-bold" }
    }

    // ゾロ目 (同じ数字が3つ)
    if (sorted[0] === sorted[1] && sorted[1] === sorted[2]) {
      return { message: `${sorted[0]}のゾロ目！`, win: true, class: "text-blue-500 font-bold" }
    }

    // シゴロ (4, 5, 6)
    if (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6) {
      return { message: "シゴロ！", win: true, class: "text-green-500 font-bold" }
    }

    // 通常の目 (同じ数字が2つ)
    if (sorted[0] === sorted[1] || sorted[1] === sorted[2]) {
      let value
      if (sorted[0] === sorted[1]) {
        value = sorted[2]
      } else {
        value = sorted[0]
      }
      return { message: `${value}の目`, win: true, class: "text-yellow-500" }
    }

    // ヒフミ (1, 2, 3)
    if (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) {
      return { message: "ヒフミ...", win: false, class: "text-gray-500" }
    }

    // ブタ (出目がバラバラで、ヒフミでもシゴロでもない)
    return { message: "ブタ...", win: false, class: "text-gray-500" }
  }

  // シェア機能
  const shareGame = () => {
    try {
      if (navigator.share) {
        navigator
          .share({
            title: "チンチロゲーム - YokaUnit",
            text: "オンラインで遊べるチンチロゲームをチェックしてみてください！",
            url: window.location.href,
          })
          .catch((error) => {
            console.error("シェアに失敗しました:", error)
            fallbackShare()
          })
      } else {
        fallbackShare()
      }
    } catch (error) {
      console.error("シェア機能でエラーが発生しました:", error)
      fallbackShare()
    }
  }

  // フォールバックのシェア機能（クリップボードにコピー）
  const fallbackShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast({
          title: "URLをコピーしました",
          description: "友達にシェアしてください！",
        })
      })
      .catch((err) => {
        console.error("クリップボードへのコピーに失敗しました:", err)
        toast({
          title: "シェアできませんでした",
          description: "URLを手動でコピーしてください",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <Head>
        <title>チンチロゲーム | 無料オンラインサイコロゲーム - YokaUnit</title>
        <meta
          name="description"
          content="チンチロは3つのサイコロを振って役を作る日本の伝統的なゲームです。ピンゾロ、ゾロ目、シゴロなどの役を揃えて遊べる無料オンラインゲーム。スマホでも楽しめます。"
        />
        <meta
          name="keywords"
          content="チンチロ, サイコロゲーム, オンラインゲーム, 無料ゲーム, ピンゾロ, ゾロ目, シゴロ, 3D, ブラウザゲーム"
        />
        <meta property="og:title" content="チンチロゲーム | 無料オンラインサイコロゲーム - YokaUnit" />
        <meta
          property="og:description"
          content="3つのサイコロを振って役を作る日本の伝統的なゲーム。ピンゾロ、ゾロ目、シゴロなどの役を揃えて遊べる無料オンラインゲーム。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yokaunit.com/tools/chinchiro" />
        <meta property="og:image" content="https://yokaunit.com/images/chinchiro-ogp.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yokaunit.com/tools/chinchiro" />
      </Head>

      <SiteHeader />

      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "ツール一覧", href: "/tools" },
              { label: "チンチロゲーム", href: "/tools/chinchiro" },
            ]}
          />

          <div className="mt-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">チンチロゲーム</h1>
            <p className="mt-2 text-gray-600">
              チンチロは3つのサイコロを振って役を作る日本の伝統的なゲームです。ピンゾロ、ゾロ目、シゴロなどの役を揃えて遊びましょう。
            </p>
          </div>

          <Card className="shadow-md border-0 overflow-hidden mb-4">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                    <DiceIcon className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">チンチロゲーム</CardTitle>
                    <CardDescription>3つのサイコロを振って役を作るゲーム</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center space-x-2">
                    <Switch id="continue-mode" checked={continueMode} onCheckedChange={setContinueMode} />
                    <Label htmlFor="continue-mode" className="text-xs">
                      現在位置から回す
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? "音を消す" : "音を出す"}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
                  <Canvas shadows>
                    <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
                    <ambientLight intensity={0.7} />
                    <directionalLight
                      position={[5, 5, 5]}
                      intensity={1}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                    />
                    <Physics gravity={[0, -20, 0]}>
                      <Table />
                      <Bowl />
                      <Walls />
                      <Dice
                        index={0}
                        position={[-1.5, 0, 0]}
                        rolling={rolling}
                        onRest={handleDiceRest}
                        color="#f5f5f5"
                        resetPosition={resetTrigger}
                        continueFromCurrent={continueMode}
                        rollTrigger={rollTrigger}
                      />
                      <Dice
                        index={1}
                        position={[0, 0, 0]}
                        rolling={rolling}
                        onRest={handleDiceRest}
                        color="#f5f5f5"
                        resetPosition={resetTrigger}
                        continueFromCurrent={continueMode}
                        rollTrigger={rollTrigger}
                      />
                      <Dice
                        index={2}
                        position={[1.5, 0, 0]}
                        rolling={rolling}
                        onRest={handleDiceRest}
                        color="#f5f5f5"
                        resetPosition={resetTrigger}
                        continueFromCurrent={continueMode}
                        rollTrigger={rollTrigger}
                      />
                    </Physics>
                    <Environment preset="park" background />
                    <CameraControls zoomIn={zoomIn} zoomOut={zoomOut} resetCamera={resetCamera} isMobile={isMobile} />
                  </Canvas>
                </Suspense>

                {/* カメラコントロール */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/80 hover:bg-white shadow-md"
                    onClick={zoomIn}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/80 hover:bg-white shadow-md"
                    onClick={zoomOut}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/80 hover:bg-white shadow-md"
                    onClick={resetCamera}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* モバイル用のコントロール */}
                <div className="md:hidden absolute bottom-2 left-2 flex items-center gap-2 bg-white/80 p-2 rounded-md">
                  <Switch id="continue-mode-mobile" checked={continueMode} onCheckedChange={setContinueMode} />
                  <Label htmlFor="continue-mode-mobile" className="text-xs">
                    現在位置から回す
                  </Label>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="flex gap-2 mb-2">
                    {diceValues.map((value, index) => (
                      <Badge key={index} variant="outline" className="text-lg px-3 py-1 bg-white shadow-sm">
                        {value || "-"}
                      </Badge>
                    ))}
                  </div>
                  <ResultDisplay result={result} resultClass={resultClass} />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button
                    className="col-span-3 bg-amber-600 hover:bg-amber-700 text-white"
                    size="lg"
                    onClick={rollDice}
                    disabled={rolling}
                  >
                    {rolling ? "振っています..." : "サイコロを振る"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetDice}
                    className="col-span-1"
                    title="サイコロをリセット"
                    size="lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">リセット</span>
                  </Button>
                </div>

                {/* シェアボタン */}
                <div className="flex justify-center mt-4">
                  <Button variant="ghost" size="sm" onClick={shareGame} className="text-gray-600">
                    <Share2 className="h-4 w-4 mr-2" />
                    友達にシェアする
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* タブ（履歴とルール）- モバイルでもサイコロの直下に表示 */}
          <Tabs defaultValue="history" className="mb-6">
            <TabsList className="grid w-full grid-cols-2 h-10 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger
                value="history"
                className="rounded-md flex items-center gap-2 h-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                <History className="h-4 w-4" />
                <span>履歴</span>
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="rounded-md flex items-center gap-2 h-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                <HelpCircle className="h-4 w-4" />
                <span>ルール</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4" />
                    最近の結果
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {history.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-8 bg-gray-50 rounded-lg">
                      まだ履歴がありません
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {history.map((item) => (
                        <div key={item.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between">
                            <div className="flex gap-1">
                              {item.values.map((value, i) => (
                                <Badge key={i} variant="outline" className="text-sm bg-white">
                                  {value}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.id).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                          <div className="mt-2 font-medium">{item.result}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    チンチロについて
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-4">
                    <p>
                      チンチロは日本の伝統的なサイコロゲームで、3つのサイコロを振って出た目の組み合わせで役を作ります。
                      元々は賭博として知られていましたが、現在では単純な運ゲームとして楽しまれています。
                    </p>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="font-bold mb-3">役一覧（強い順）</h3>
                      <div className="grid gap-2">
                        <div className="flex items-center p-2 rounded-md bg-red-50">
                          <Badge variant="outline" className="bg-white text-red-500 mr-2">
                            ピンゾロ
                          </Badge>
                          <span>1-1-1</span>
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-blue-50">
                          <Badge variant="outline" className="bg-white text-blue-500 mr-2">
                            ゾロ目
                          </Badge>
                          <span>同じ数字3つ</span>
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-green-50">
                          <Badge variant="outline" className="bg-white text-green-500 mr-2">
                            シゴロ
                          </Badge>
                          <span>4-5-6</span>
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-yellow-50">
                          <Badge variant="outline" className="bg-white text-yellow-500 mr-2">
                            通常の目
                          </Badge>
                          <span>同じ数字2つと別の数字</span>
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-gray-50">
                          <Badge variant="outline" className="bg-white text-gray-500 mr-2">
                            ヒフミ
                          </Badge>
                          <span>1-2-3 / 負け</span>
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-gray-50">
                          <Badge variant="outline" className="bg-white text-gray-500 mr-2">
                            ブタ
                          </Badge>
                          <span>バラバラの目 / 負け</span>
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-gray-50">
                          <Badge variant="outline" className="bg-white text-gray-500 mr-2">
                            しょんべん
                          </Badge>
                          <span>サイコロが器から出る / 負け</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="font-bold mb-2">遊び方</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>「サイコロを振る」ボタンをクリックします</li>
                        <li>3つのサイコロが振られ、止まるのを待ちます</li>
                        <li>出た目の組み合わせによって役が決まります</li>
                        <li>「リセット」ボタンでサイコロを初期位置に戻せます</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
