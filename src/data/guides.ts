import type { CollectionEntry } from 'astro:content';

export type GuideId = 'training' | 'home-gym' | 'nutrition' | 'safety';

export interface GuideMeta {
	id: GuideId;
	href: string;
	shortTitle: string;
	title: string;
	badge: string;
	icon: string;
	summary: string;
	readingMinutes: number;
}

export interface RecommendedGuideLink {
	href: string;
	label: string;
	title: string;
	description: string;
	icon: string;
	role: 'primary' | 'secondary';
}

export const GUIDE_HUB = {
	href: '/guide/',
	shortTitle: '基礎知識トップ',
	title: '自宅筋トレの基礎知識ガイド',
	description:
		'宅トレ歴5年（68kg→82kg）の管理人が体系化した自宅筋トレの基礎知識ハブ。目的別のフォームとメニュー設計、ダンベル（可変式・プレート式）と耐荷重300kg以上ベンチの選び方、プロテイン栄養、保護ギアによる安全対策を解説します。',
	icon: '📖',
};

export const GUIDE_PAGES: GuideMeta[] = [
	{
		id: 'training',
		href: '/guide/training/',
		shortTitle: '目的別設計',
		title: '目的別筋トレ設計｜筋肥大・筋力UP',
		badge: 'まずここから',
		icon: '🎯',
		summary:
			'筋肥大か筋力UPかで変わるフォーム・重量・回数・セット数・休憩時間、漸進性過負荷と回復理論、週間メニューの組み方を整理します。',
		readingMinutes: 6,
	},
	{
		id: 'home-gym',
		href: '/guide/home-gym/',
		shortTitle: '機材選び',
		title: '自宅機材｜ダンベル・300kgベンチ',
		badge: '必須アイテム',
		icon: '🏋️',
		summary:
			'最低限必要なダンベル（可変式／シャフト＋プレート）とアジャスタブルベンチ（耐荷重300kg以上推奨）、追加機材や保護ギアへの段階投資を解説。',
		readingMinutes: 7,
	},
	{
		id: 'nutrition',
		href: '/guide/nutrition/',
		shortTitle: '栄養・プロテイン',
		title: 'プロテインと栄養の基礎｜種類と摂り方',
		badge: '食事・栄養',
		icon: '🥤',
		summary:
			'1日の総タンパク質目安と食事の基本、ホエイ（WPC/WPI）・カゼイン・ソイの使い分け、摂取タイミングと補助サプリの基礎をまとめます。',
		readingMinutes: 7,
	},
	{
		id: 'safety',
		href: '/guide/safety/',
		shortTitle: '安全・保護ギア',
		title: '筋トレの怪我予防｜保護ギアと安全対策',
		badge: '安全・ギア',
		icon: '🛡️',
		summary:
			'関節を守るフォーム原則、高重量期に検討したいベルト・リストラップ・パワーグリップ・スリーブ類の選び方、床補強やロック確認を詳解。',
		readingMinutes: 5,
	},
];

const RE_NUTRITION =
	/protein|プロテイン|whey|ホエイ|soy|ソイ|casein|カゼイン|bcaa|eaa|amino|アミノ|arginine|アルギニン|hmb|creatine|クレアチン|preworkout|pre-workout|プレワークアウト|caffeine|カフェイン|fat-burn|speedshape|スピードシェイプ|dearnatura|belegend|valx|fixit|myprotein|explosion|サプリ/i;
const RE_CHINNING_EXCLUDE = /chinning-machine|懸垂マシン/i;
const RE_SAFETY =
	/yoga-mat|ヨガマット|wrist-wrap|リストラップ|elbow-sleeve|エルボースリーブ|knee-sleeve|ニースリーブ|power-grip|パワーグリップ|gloves|グローブ|dipping-belt|ディッピングベルト|ab-straps|アブストラップ|training-belt|トレーニングベルト|パワーベルト|リフティングベルト/i;
const RE_CORE_HOME_GYM =
	/dumbbell|ダンベル|barbell|バーベル|ez-bar|kettlebell|ケトルベル|plate|プレート|bench|ベンチ|rack|ラック/i;
const RE_NON_DUMBBELL_EQUIP =
	/resistance-bands|training-tube|トレーニングチューブ|squat-home-equipment|スクワット.*器具/i;
const RE_MACHINE_SUB =
	/pull-up|chinning|懸垂|チンニング|stepper|ステッパー|merach|alinco|wasai/i;

/**
 * 記事のスラッグ・タイトル・メディア種別に応じて、読者へ案内する基礎知識ページ（主・副2件）を返す。
 */
export function getRecommendedGuidesForPost(
	slug: string,
	title: string,
	mediaType?: string
): RecommendedGuideLink[] {
	const text = `${slug} ${title}`.toLowerCase();
	const isChinning = RE_CHINNING_EXCLUDE.test(slug);

	// 1. プロテイン・サプリメント記事 -> 栄養（主）＋ トレーニング設計（副）
	if (
		!isChinning &&
		(RE_NUTRITION.test(text) || mediaType === 'protein' || mediaType === 'supplement')
	) {
		return [
			{
				href: '/guide/nutrition/',
				label: 'プロテイン・栄養の基礎',
				title: 'プロテインと栄養の基礎｜種類と摂り方',
				description:
					'ホエイWPC/WPI・カゼイン・ソイの使い分けや1日のタンパク質目安、食事との組み合わせ方を解説。',
				icon: '🥤',
				role: 'primary',
			},
			{
				href: '/guide/training/',
				label: '目的別メニュー設計',
				title: '目的別筋トレ設計｜筋肥大・筋力UP',
				description:
					'栄養摂取の効果を活かすための筋肥大・筋力UP別フォーム・回数設定と回復の基本を整理しています。',
				icon: '🎯',
				role: 'secondary',
			},
		];
	}

	// 2. 保護ギア・マット・安全グッズ記事 -> 安全・保護ギア（主）＋ 機材選び（副）
	if (RE_SAFETY.test(text)) {
		return [
			{
				href: '/guide/safety/',
				label: '安全対策とギア選び',
				title: '筋トレの怪我予防｜保護ギアと安全対策',
				description:
					'リストラップ・パワーグリップ・ベルト等の導入目安や、床補強・防音マット・関節保護の基本を解説。',
				icon: '🛡️',
				role: 'primary',
			},
			{
				href: '/guide/home-gym/',
				label: '自宅機材の基本構成',
				title: '自宅機材｜ダンベル・300kgベンチ',
				description:
					'ダンベル（可変式・プレート式）と耐荷重300kg以上のアジャスタブルベンチを核にした自宅環境の揃え方をまとめています。',
				icon: '🏋️',
				role: 'secondary',
			},
		];
	}

	// 3. ダンベル・バーベル・ベンチ・ラック・プレート記事 -> 機材選び（主）＋ トレーニング設計（副）
	if (
		RE_CORE_HOME_GYM.test(text) ||
		(mediaType === 'dumbbell' && !RE_NON_DUMBBELL_EQUIP.test(text))
	) {
		return [
			{
				href: '/guide/home-gym/',
				label: '必須機材・スペック基準',
				title: '自宅機材｜ダンベル・300kgベンチ',
				description:
					'ダンベル（可変式／シャフト＋プレート）と耐荷重300kg以上ベンチの重要性、高重量期のギア検討まで解説。',
				icon: '🏋️',
				role: 'primary',
			},
			{
				href: '/guide/training/',
				label: '目的別の重量・回数設定',
				title: '目的別筋トレ設計｜筋肥大・筋力UP',
				description:
					'筋肥大と筋力UPで変わるフォーム意識・重量・回数・セット数と漸進性過負荷の原則を確認できます。',
				icon: '🎯',
				role: 'secondary',
			},
		];
	}

	// 4. 懸垂・自重・マシン・タイマー等 -> トレーニング設計（主）＋ 機材選び または 安全対策（副）
	if (RE_MACHINE_SUB.test(text) || mediaType === 'machine') {
		return [
			{
				href: '/guide/training/',
				label: '目的別筋トレ設計',
				title: '目的別筋トレ設計｜筋肥大・筋力UP',
				description:
					'目的に応じたフォーム・負荷・セット数の組み方と、回復理論・部位分割の基本ルールをまとめています。',
				icon: '🎯',
				role: 'primary',
			},
			{
				href: '/guide/home-gym/',
				label: '自宅機材・導入基準',
				title: '自宅機材｜ダンベル・300kgベンチ',
				description:
					'ダンベル＆ベンチを土台に、懸垂マシンや追加機材を省スペースで揃える優先順位を解説しています。',
				icon: '🏋️',
				role: 'secondary',
			},
		];
	}

	return [
		{
			href: '/guide/training/',
			label: '目的別筋トレ設計',
			title: '目的別筋トレ設計｜筋肥大・筋力UP',
			description:
				'筋肥大か筋力UPかで変わるフォーム・重量・回数設定と、継続して伸ばす漸進性過負荷の原則を解説。',
			icon: '🎯',
			role: 'primary',
		},
		{
			href: '/guide/safety/',
			label: 'フォームと安全対策',
			title: '筋トレの怪我予防｜保護ギアと安全対策',
			description:
				'関節に負担をかけないフォーム原則や自宅トレの床・器具チェック、段階的な保護ギア導入のコツを紹介。',
			icon: '🛡️',
			role: 'secondary',
		},
	];
}

/**
 * 各基礎知識ページの下部に表示する関連既存記事を自動抽出する。
 */
export function filterPostsForGuide(
	guideId: GuideId,
	posts: CollectionEntry<'blog'>[],
	limit = 6
): CollectionEntry<'blog'>[] {
	const scored = posts
		.map((post) => {
			const text = `${post.id} ${post.data.title}`.toLowerCase();
			const mediaType = post.data.mediaType || '';
			let score = 0;

			if (guideId === 'nutrition') {
				if (!RE_CHINNING_EXCLUDE.test(post.id)) {
					if (RE_NUTRITION.test(text)) score += 90;
					if (mediaType === 'protein' || mediaType === 'supplement') score += 50;
				}
			} else if (guideId === 'safety') {
				if (RE_SAFETY.test(text)) score += 90;
				if (mediaType === 'gear' && RE_SAFETY.test(text)) score += 30;
			} else if (guideId === 'home-gym') {
				if (RE_CORE_HOME_GYM.test(text)) score += 80;
				if (mediaType === 'dumbbell' || mediaType === 'machine') score += 40;
				if (/24kg|40kg|nuobell|incline|multi-position|ez-bar|half-power-rack|long-shaft|550mm/i.test(post.id)) score += 25;
			} else if (guideId === 'training') {
				if (!RE_NUTRITION.test(text) && !RE_SAFETY.test(text)) {
					if (/home-workout-bench-dumbbell-max|variable-dumbbell-24kg-workout|dumbbell-barbell-plates|training-timer-interval|incline-dumbbell-bench|arm-workout-biceps-triceps|pull-up-dip-station-barbell-rack/i.test(post.id)) score += 95;
					else if (/pull-up|chinning|ab-roller|push-up|split-board|timer/i.test(post.id)) score += 80;
					else if (RE_CORE_HOME_GYM.test(text) && /24kg|anatomy|science|variable/i.test(post.id)) score += 55;
					else if (mediaType === 'machine' || mediaType === 'dumbbell') score += 30;
				}
			}

			if (post.data.featured) score += 8;
			return { post, score };
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
		});

	return scored.slice(0, limit).map((item) => item.post);
}
