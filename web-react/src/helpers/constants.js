import BarChartIcon from '@mui/icons-material/BarChart'
import GroupIcon from '@mui/icons-material/Group'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import PetsIcon from '@mui/icons-material/Pets'
import RedeemIcon from '@mui/icons-material/Redeem'

import AbcIcon from '@mui/icons-material/Abc'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import HdrStrongIcon from '@mui/icons-material/HdrStrong'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const SECTIONS = [
  {
    label: 'Analytics',
    longName: 'Analytics',
    href: 'https://analytics.google.com/analytics/web/',
    icon: BarChartIcon,
    description: 'View analytics',
    external: true,
  },
  {
    label: 'Users',
    longName: 'Browse users',
    href: '/users',
    icon: GroupIcon,
    description: 'Browse users data',
  },
  {
    label: 'Admin',
    longName: 'Administrators',
    href: '/admin',
    icon: AdminPanelSettingsIcon,
    description: 'You can invite other administators and change their rights',
  },
  {
    label: 'Games',
    longName: 'Manage games',
    href: '/games',
    description: 'Add more content to different games',
    icon: VideogameAssetIcon,
  },
  {
    label: 'Avatars',
    longName: 'Avatars',
    description: 'Create and manage avatar lists',
    href: '/avatars',
    icon: PetsIcon,
  },
  {
    label: 'Gifts',
    longName: 'Gifts',
    href: '/gifts',
    description: 'Manage gift calendar',
    icon: RedeemIcon,
  },
  {
    label: 'Grammar Modules',
    longName: 'Grammar Modules',
    href: '/grammar-modules',
    description: 'Manage grammar modules',
    icon: AbcIcon,
  },
]
const GAMES = [
  {
    label: 'Synonym Roll',
    href: '/games/synonym-roll',
    icon: DragIndicatorIcon,
  },
  {
    label: 'Antonym Hunt',
    href: '/games/antonym-hunt',
    icon: HdrStrongIcon,
  },
  {
    label: 'Fab Vocab',
    href: '/games/fab-vocab',
    icon: InsertPhotoIcon,
  },
  {
    label: 'Grammar Geek',
    href: '/games/grammar-geek',
    icon: AbcIcon,
  },
  {
    label: 'Knowlympics',
    href: '/games/knowlympics',
    icon: EmojiEventsIcon,
  },
]

const AVATAR_PAGES = [
  {
    label: 'Avatars',
    href: '/avatars',
  },
  {
    label: 'Avatar collections',
    href: '/avatars-collections',
  },
]

const RIGHTS = [
  {
    id: 'ADMIN',
    label: 'Admin',
    description:
      'Admin can do everything including adding/deleting and modifying other super users',
  },
  {
    id: 'EDITOR',
    label: 'Editor',
    description: 'Editor can edit everything but admins or invite other admins',
  },
  {
    id: 'READER',
    label: 'Reader',
    description: 'Readers can only browse data but not modify',
  },
]
const REWARDS = [
  {
    id: 'COINS',
    label: 'Coins',
    picture: '/img/coins.png',
  },
  {
    id: 'STAR_PERCENTAGE',
    label: 'Star Percentage',
    picture: '/img/star_percentage.png',
  },
  {
    id: 'STARS',
    label: 'Stars',
    picture: '/img/stars.png',
  },
]

const FIELD_TYPES = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  OBJECT: 'OBJECT',
  ARRAY: 'ARRAY',
  SELECT: 'SELECT',
  PICTURE: 'PICTURE',
  AVATAR_ARRAY: 'AVATAR_ARRAY',
}

export { SECTIONS, RIGHTS, GAMES, FIELD_TYPES, AVATAR_PAGES, REWARDS }
