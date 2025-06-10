-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin', 'developer');
CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'enterprise');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    subscription_status subscription_status DEFAULT 'free' NOT NULL,
    subscription_expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create tools table with extended fields
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[],
    icon TEXT NOT NULL,
    href TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false NOT NULL,
    is_private BOOLEAN DEFAULT false NOT NULL,
    is_new BOOLEAN DEFAULT false NOT NULL,
    is_popular BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    view_count INTEGER DEFAULT 0 NOT NULL,
    view_count_total INTEGER DEFAULT 0 NOT NULL,
    favorite_count INTEGER DEFAULT 0 NOT NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tool_slug TEXT REFERENCES tools(slug) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, tool_slug)
);

-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create audit_logs table for security and monitoring
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create test table for connection testing
CREATE TABLE IF NOT EXISTS test (
    id SERIAL PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_subcategory ON tools(subcategory);
CREATE INDEX IF NOT EXISTS idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tools_is_premium ON tools(is_premium);
CREATE INDEX IF NOT EXISTS idx_tools_is_private ON tools(is_private);
CREATE INDEX IF NOT EXISTS idx_tools_is_new ON tools(is_new);
CREATE INDEX IF NOT EXISTS idx_tools_is_popular ON tools(is_popular);
CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);
CREATE INDEX IF NOT EXISTS idx_tools_likes_count ON tools(likes_count);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_tool_slug ON user_favorites(tool_slug);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'developer')
        )
    );

-- Create RLS policies for user_favorites
CREATE POLICY "Users can manage their own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'developer')
        )
    );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to log user actions
CREATE OR REPLACE FUNCTION public.log_user_action(
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
    VALUES (auth.uid(), p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment tool view count
CREATE OR REPLACE FUNCTION increment_tool_view(tool_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE tools 
    SET view_count_total = view_count_total + 1,
        updated_at = NOW()
    WHERE slug = tool_slug AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update tool favorite count
CREATE OR REPLACE FUNCTION update_tool_favorite_count(tool_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE tools 
    SET favorite_count = (
        SELECT COUNT(*) 
        FROM user_favorites 
        WHERE tool_slug = tools.slug
    ),
    updated_at = NOW()
    WHERE slug = tool_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for favorite count updates
CREATE OR REPLACE FUNCTION update_favorite_count_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM update_tool_favorite_count(NEW.tool_slug);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_tool_favorite_count(OLD.tool_slug);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for favorite count updates
DROP TRIGGER IF EXISTS trigger_update_favorite_count ON user_favorites;
CREATE TRIGGER trigger_update_favorite_count
    AFTER INSERT OR DELETE ON user_favorites
    FOR EACH ROW EXECUTE FUNCTION update_favorite_count_trigger();

-- Create view for tools with statistics
CREATE OR REPLACE VIEW tools_with_stats AS
SELECT 
    t.*,
    COALESCE(fav_count.count, 0) as favorite_count_actual
FROM tools t
LEFT JOIN (
    SELECT tool_slug, COUNT(*) as count
    FROM user_favorites
    GROUP BY tool_slug
) fav_count ON t.slug = fav_count.tool_slug
WHERE t.is_active = true;

-- Clear existing tools data and insert new data
TRUNCATE TABLE tools RESTART IDENTITY CASCADE;

-- Insert sample test data
INSERT INTO test (name) VALUES 
    ('テストデータ1'),
    ('テストデータ2'),
    ('接続確認用データ');

-- Insert comprehensive tools data
INSERT INTO tools (slug, title, description, category, subcategory, tags, href, is_premium, is_private, is_new, is_popular, likes_count) VALUES
-- 生産性ツール
('pomodoro', 'シンプルなポモドーロタイマー', '集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。作業効率を高めたい方におすすめです。', '生産性', 'タイマー', ARRAY['タイマー', '集中力', '生産性向上'], '/tools/pomodoro', false, false, true, true, 87),
('todo', 'シンプルToDoリスト', 'シンプルで使いやすいタスク管理ツール。ブラウザに保存されるので登録不要です。', '生産性', 'タスク管理', ARRAY['タスク管理', 'ToDoリスト', '生産性'], '/tools/todo', false, false, false, false, 78),

-- 画像・メディアツール
('image-resize', '画像リサイズツール', 'ドラッグ&ドロップで簡単に画像サイズを変更できます。複数形式に対応。SNS投稿用のサイズ設定も簡単です。', '画像・メディア', '画像編集', ARRAY['画像編集', 'リサイズ', 'SNS最適化'], '/tools/image-resize', false, false, false, true, 189),
('video-trim', '動画トリミングツール', 'オンラインで簡単に動画の不要な部分をカットできます。登録不要で即座に利用可能です。', '画像・メディア', '動画編集', ARRAY['動画編集', 'トリミング', 'カット'], '/tools/video-trim', false, false, false, false, 65),
('audio-recorder', 'シンプル音声レコーダー', 'ブラウザ上で高品質な音声録音ができます。会議や講義の録音に最適です。', '画像・メディア', '音声', ARRAY['録音', '音声', '会議'], '/tools/audio-recorder', false, false, false, false, 42),
('image-editor-pro', 'プロ仕様画像編集ツール', '高度な画像編集機能を備えたプロ仕様ツール。背景除去、フィルター、AIによる画像補正など。', '画像・メディア', '画像編集', ARRAY['画像編集', 'プロ仕様', 'AI補正'], '/tools/premium-tool', true, false, true, true, 42),

-- テキスト処理ツール
('markdown', 'マークダウンエディタ', 'リアルタイムプレビュー付きのシンプルなマークダウンエディタ。ブログ記事やドキュメント作成に便利です。', 'テキスト処理', 'テキスト', ARRAY['マークダウン', 'エディタ', '文書作成'], '/tools/markdown', false, false, false, true, 124),
('notes', 'オンラインメモ帳', 'シンプルなメモ帳アプリ。自動保存機能付きで、アイデアをすぐにメモできます。', 'テキスト処理', 'テキスト', ARRAY['メモ', 'ノート', 'テキスト'], '/tools/notes', false, false, false, false, 56),

-- セキュリティツール
('password', 'パスワード生成ツール', '安全なパスワードを簡単に生成。強度チェック機能付き。オンラインセキュリティ向上に役立ちます。', 'セキュリティ', 'セキュリティ', ARRAY['パスワード', 'セキュリティ', '暗号'], '/tools/password', false, false, true, true, 245),

-- ファイル変換ツール
('pdf-to-image', 'PDFから画像への変換', 'PDFの各ページをJPG/PNG形式で保存できます。高品質な変換で文書共有が簡単になります。', 'ファイル変換', 'ファイル変換', ARRAY['PDF', '画像変換', 'ドキュメント'], '/tools/pdf-to-image', false, false, false, true, 156),
('csv-json', 'CSV⇔JSON変換', 'CSVとJSON形式のデータを簡単に相互変換。データ分析や開発に役立ちます。', 'ファイル変換', 'データ変換', ARRAY['CSV', 'JSON', 'データ処理'], '/tools/csv-json', false, false, false, false, 76),

-- 開発者向けツール
('json-yaml', 'JSON⇔YAML変換', 'JSONとYAML形式を相互に変換できるツール。開発者のための便利なユーティリティです。', '開発者向け', '開発者向け', ARRAY['JSON', 'YAML', 'データ変換'], '/tools/json-yaml', false, false, false, false, 89),

-- 計算ツール
('unit-converter', '単位変換ツール', '長さ、重さ、温度など様々な単位を簡単に変換できます。日常生活や学習に役立ちます。', '計算ツール', '単位変換', ARRAY['単位変換', '計算', '数値'], '/tools/unit-converter', false, false, true, false, 35),
('percentage', 'パーセント計算機', '割引計算や増加率など、様々なパーセント計算が簡単にできます。', '計算ツール', '基本計算', ARRAY['計算', 'パーセント', '割引'], '/tools/percentage', false, false, false, false, 48),
('date-calculator', '日付計算ツール', '二つの日付の間の日数や、特定の日数後の日付を計算できます。', '計算ツール', '日付・時間', ARRAY['日付', '計算', 'カレンダー'], '/tools/date-calculator', false, false, false, false, 37),
('loan-calculator', 'ローン計算機', '住宅ローンや自動車ローンの月々の支払額を簡単に計算できます。', '計算ツール', '金融', ARRAY['ローン', '金融', '計算'], '/tools/loan-calculator', false, false, true, false, 29),
('tax-calculator', '消費税計算機', '税込・税抜価格を簡単に計算。軽減税率にも対応しています。', '計算ツール', '金融', ARRAY['消費税', '計算', '金融'], '/tools/tax-calculator', false, false, false, false, 43),

-- 健康・生活ツール
('bmi-calculator', 'BMI計算機', '身長と体重からBMIを計算し、健康状態の目安を確認できます。', '健康・生活', '健康指標', ARRAY['BMI', '健康', '計算'], '/tools/bmi-calculator', false, false, false, false, 52),
('calorie-calculator', 'カロリー計算機', '食品のカロリーを計算し、日々の摂取カロリーを管理できます。', '健康・生活', '栄養', ARRAY['カロリー', '健康', 'ダイエット'], '/tools/calorie-calculator', false, false, true, false, 31),
('meditation-timer', '瞑想タイマー', '瞑想や集中作業のためのタイマー。リラックスした音楽と通知機能付き。', '健康・生活', 'マインドフルネス', ARRAY['瞑想', 'タイマー', 'リラックス'], '/tools/meditation-timer', false, false, true, false, 33),
('water-reminder', '水分摂取リマインダー', '適切な水分摂取を促すリマインダーツール。健康的な生活習慣をサポートします。', '健康・生活', '健康管理', ARRAY['水分', 'リマインダー', '健康'], '/tools/water-reminder', false, false, false, false, 28),
('sleep-calculator', '睡眠サイクル計算機', '睡眠サイクルに基づいて最適な就寝・起床時間を計算するツール。', '健康・生活', '睡眠', ARRAY['睡眠', 'サイクル', '健康'], '/tools/sleep-calculator', false, false, false, false, 41),

-- ゲームツール
('random-generator', 'ランダム生成ツール', '数字、文字列、リストからのランダム選択ができるツール。くじ引きやゲームに便利です。', 'ゲーム', 'ランダム', ARRAY['ランダム', 'くじ引き', '選択'], '/tools/random-generator', false, false, false, false, 67),
('dice-roller', 'サイコロシミュレーター', '様々な面数のサイコロを振れるシミュレーター。ボードゲームやTRPGに最適です。', 'ゲーム', 'シミュレーター', ARRAY['サイコロ', 'ゲーム', 'TRPG'], '/tools/dice-roller', false, false, true, false, 24),
('chinchiro', 'チンチロリン', '3つのサイコロを使った伝統的な賭けゲーム。リアルな3Dサイコロと本格的なルールで楽しめます。', 'ゲーム', '賭けゲーム', ARRAY['サイコロ', 'ゲーム', '賭け'], '/tools/chinchiro', false, false, true, true, 95),
('name-generator', '名前生成ツール', 'キャラクター名やビジネス名などをランダムに生成できるツール。創作活動に役立ちます。', 'ゲーム', '創作', ARRAY['名前', '創作', 'ランダム'], '/tools/name-generator', false, false, false, false, 38),

-- デザインツール
('color-palette', 'カラーパレット生成', '調和の取れたカラーパレットを自動生成。デザイン作業に役立ちます。', 'デザイン', 'カラー', ARRAY['カラー', 'デザイン', 'パレット'], '/tools/color-palette', false, false, false, true, 112),

-- 学習・教育ツール
('flashcards', 'フラッシュカード学習', '自分だけのフラッシュカードを作成して効率的に学習できるツール。語学学習に最適です。', '学習・教育', '学習', ARRAY['フラッシュカード', '学習', '暗記'], '/tools/flashcards', false, false, true, false, 27),
('math-practice', '算数練習ツール', '基本的な算数問題を自動生成して練習できるツール。お子様の学習に役立ちます。', '学習・教育', '算数', ARRAY['算数', '練習', '学習'], '/tools/math-practice', false, false, false, false, 19),
('typing-practice', 'タイピング練習', 'タイピングスピードと正確性を向上させるための練習ツール。初心者から上級者まで対応。', '学習・教育', 'タイピング', ARRAY['タイピング', '練習', 'キーボード'], '/tools/typing-practice', false, false, false, false, 45),

-- ビジネスツール
('data-analyzer', '企業向けデータ分析ツール', '高度なデータ分析と可視化が可能な企業向け特別ツール。限定公開です。', 'ビジネス', 'データ分析', ARRAY['データ分析', 'ビジネス', '可視化'], '/tools/private-tool', false, true, true, false, 15),
('report-generator', 'ビジネスレポート生成', 'データからプロフェッショナルなビジネスレポートを自動生成するプレミアムツール。', 'ビジネス', 'レポート', ARRAY['レポート', 'ビジネス', '自動生成'], '/tools/premium-tool', true, false, false, false, 22),
('project-planner', 'プロジェクト計画ツール', 'プロジェクトのタイムラインとリソース配分を計画するための高度なツール。', 'ビジネス', 'プロジェクト管理', ARRAY['プロジェクト', '計画', '管理'], '/tools/premium-tool', true, false, false, false, 18);
