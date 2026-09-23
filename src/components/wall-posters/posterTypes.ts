import youngWomanPosterImg from '../../assets/images/yw_flat_poster_1789804725776.jpg';
import ancoraDomaniPosterImg from '../../assets/images/cd_flat_poster_1789804741230.jpg';
import paprikaPosterImg from '../../assets/images/pk_flat_poster_1789804763105.jpg';
import pastoralValleyPosterImg from '../../assets/images/country_sheep_viaduct_1789892269659.jpg';

export type PosterId = 'young-woman' | 'ancora-domani' | 'paprika' | 'pastoral-valley';

export interface PosterData {
  id: PosterId;
  title: string;
  originalTitle: string;
  year: string;
  director: string;
  subtitle: string;
  quote: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  imageUrl: string;
  wall?: 'left' | 'right';
}

export const POSTER_CATALOG: Record<PosterId, PosterData> = {
  'pastoral-valley': {
    id: 'pastoral-valley',
    title: '《山谷与远行》',
    originalTitle: 'Yorkshire Dales · The Pastoral Journey',
    year: '1938',
    director: '英国经典铁路旅行艺术海报',
    subtitle: '微风吹过石墙与山丘，远方列车鸣响汽笛',
    quote: '“山风穿过石墙，汽笛回荡在葱茏的山谷里，每一天都是一场宁静的出发。”',
    tagline: 'THE CALL OF THE DALES · 山谷牧歌',
    description:
      '英国约克郡山谷（Yorkshire Dales）经典的田园铁路旅行艺术海报。前景是一只伫立在断崖岩石上悠然凝望的小羊，坡地上蜿蜒着长满野花的质朴干石墙与木农门；远方葱翠宽广的山谷间，一座宏伟的石砌多孔铁路高架桥横跨绿野，古老的蒸汽机车正拖着白茫茫的烟云穿行而过。贴在阁楼工作台旁的暖白左墙上，与窗外晨昏的光影相伴，让人在忙碌之余也能抬眼望见远方的山谷与自由。',
    primaryColor: '#2e4732',
    accentColor: '#d97736',
    imageUrl: pastoralValleyPosterImg,
    wall: 'left',
  },
  'young-woman': {
    id: 'young-woman',
    title: '《泳者之心》',
    originalTitle: 'Young Woman and the Sea',
    year: '2024',
    director: '约阿希姆·罗恩尼 (Joachim Rønning)',
    subtitle: '穿越惊涛骇浪的坚韧史诗',
    quote: '“大海从不会向任何人让步，唯有信念能破浪前行。”',
    tagline: 'YOUNG WOMAN AND THE SEA',
    description:
      '根据真实历史传奇改编。讲述美国女子游泳先驱特鲁迪·埃德尔 (Trudy Ederle) 突破时代束缚与惊涛骇浪，成为历史上首位横渡英吉利海峡的伟大女性。海报上红白泳帽背影眺望暗涌苍茫的大海，成为小屋中无惧逆境的勇气象征。',
    primaryColor: '#203a4b',
    accentColor: '#c75142',
    imageUrl: youngWomanPosterImg,
    wall: 'right',
  },
  'ancora-domani': {
    id: 'ancora-domani',
    title: '《还有明天》',
    originalTitle: 'C’è ancora domani',
    year: '2023',
    director: '宝拉·柯特莱西 (Paola Cortellesi)',
    subtitle: '1946年罗马春日晨曦里的步伐',
    quote: '“投下的不是一张纸，是握在自己手中的明天。”',
    tagline: 'C’È ANCORA DOMANI · 还有明天',
    description:
      '意大利近年最震撼人心的女性现实主义杰作。描绘二战后罗马平民女性迪莉娅在困境中唤醒自我意识、迈出决定性一步的故事。海报融合建筑手绘素描与明快的大步向前剪影，洋溢着温暖坚韧的生命力。',
    primaryColor: '#36322d',
    accentColor: '#e05874',
    imageUrl: ancoraDomaniPosterImg,
    wall: 'right',
  },
  paprika: {
    id: 'paprika',
    title: '《红辣椒》',
    originalTitle: 'Paprika',
    year: '2006',
    director: '今敏 (Satoshi Kon)',
    subtitle: '梦境与现实交织的幻象哲学',
    quote:
      '“In a world of inhumane reality it is the only humane sanctuary left. That is a dream.”',
    tagline: '红辣椒 · 梦境是最后的庇护所',
    description:
      '动画大师今敏的巅峰神作。红发红衣的梦境侦探“红辣椒”穿梭于斑斓绮丽的潜意识狂想曲之中。海报上深邃静谧的午夜星空与经典的打字机英文警句，为木屋增添了一抹深沉诗意的艺术哲思。',
    primaryColor: '#1e1b4b',
    accentColor: '#a82c2e',
    imageUrl: paprikaPosterImg,
    wall: 'right',
  },
};
