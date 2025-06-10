-- ツールテーブルのみ作成
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[],
    icon TEXT NOT NULL DEFAULT 'Wrench',
    href TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false NOT NULL,
    is_private BOOLEAN DEFAULT false NOT NULL,
    is_new BOOLEAN DEFAULT false NOT NULL,
    is_popular BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- パフォーマンス用インデックス
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_premium ON tools(is_premium);
CREATE INDEX IF NOT EXISTS idx_tools_is_private ON tools(is_private);
CREATE INDEX IF NOT EXISTS idx_tools_is_new ON tools(is_new);
CREATE INDEX IF NOT EXISTS idx_tools_is_popular ON tools(is_popular);
CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);
CREATE INDEX IF NOT EXISTS idx_tools_likes_count ON tools(likes_count);

-- 既存データをクリアして新しいデータを挿入
TRUNCATE TABLE tools RESTART IDENTITY CASCADE;

-- ツールデータの挿入
INSERT INTO tools (slug, title, description, category, subcategory, tags, icon, href, is_premium, is_private, is_new, is_popular, likes_count) VALUES
('password', 'パスワード生成ツール', '安全なパスワードを簡単に生成。強度チェック機能付き。オンラインセキュリティ向上に役立ちます。', 'セキュリティ', 'セキュリティ', ARRAY['パスワード', 'セキュリティ', '暗号'], 'Shield', '/tools/password', false, false, true, true, 245),
('chinchiro', 'チンチロリン', '3つのサイコロを使った伝統的な賭けゲーム。リアルな3Dサイコロと本格的なルールで楽しめます。', 'ゲーム', '賭けゲーム', ARRAY['サイコロ', 'ゲーム', '賭け'], 'Dices', '/tools/chinchiro', false, false, true, true, 95),
('image-resize', '画像リサイズツール', 'ドラッグ&ドロップで簡単に画像サイズを変更できます。複数形式に対応。SNS投稿用のサイズ設定も簡単です。', '画像・メディア', '画像編集', ARRAY['画像編集', 'リサイズ', 'SNS最適化'], 'Image', '/tools/image-resize', false, false, false, true, 189),
('pdf-to-image', 'PDFから画像への変換', 'PDFの各ページをJPG/PNG形式で保存できます。高品質な変換で文書共有が簡単になります。', 'ファイル変換', 'ファイル変換', ARRAY['PDF', '画像変換', 'ドキュメント'], 'FileImage', '/tools/pdf-to-image', false, false, false, true, 156),
('markdown', 'マークダウンエディタ', 'リアルタイムプレビュー付きのシンプルなマークダウンエディタ。ブログ記事やドキュメント作成に便利です。', 'テキスト処理', 'テキスト', ARRAY['マークダウン', 'エディタ', '文書作成'], 'FileText', '/tools/markdown', false, false, false, true, 124),
('color-palette', 'カラーパレット生成', '調和の取れたカラーパレットを自動生成。デザイン作業に役立ちます。', 'デザイン', 'カラー', ARRAY['カラー', 'デザイン', 'パレット'], 'Palette', '/tools/color-palette', false, false, false, true, 112),
('json-yaml', 'JSON⇔YAML変換', 'JSONとYAML形式を相互に変換できるツール。開発者のための便利なユーティリティです。', '開発者向け', '開発者向け', ARRAY['JSON', 'YAML', 'データ変換'], 'Code', '/tools/json-yaml', false, false, false, false, 89),
('pomodoro', 'シンプルなポモドーロタイマー', '集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。作業効率を高めたい方におすすめです。', '生産性', 'タイマー', ARRAY['タイマー', '集中力', '生産性向上'], 'Timer', '/tools/pomodoro', false, false, true, true, 87),
('todo', 'シンプルToDoリスト', 'シンプルで使いやすいタスク管理ツール。ブラウザに保存されるので登録不要です。', '生産性', 'タスク管理', ARRAY['タスク管理', 'ToDoリスト', '生産性'], 'CheckSquare', '/tools/todo', false, false, false, false, 78),
('csv-json', 'CSV⇔JSON変換', 'CSVとJSON形式のデータを簡単に相互変換。データ分析や開発に役立ちます。', 'ファイル変換', 'データ変換', ARRAY['CSV', 'JSON', 'データ処理'], 'RefreshCw', '/tools/csv-json', false, false, false, false, 76);
