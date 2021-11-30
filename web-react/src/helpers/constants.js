import BarChartIcon from '@mui/icons-material/BarChart'
import GroupIcon from '@mui/icons-material/Group'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import PetsIcon from '@mui/icons-material/Pets'
import RedeemIcon from '@mui/icons-material/Redeem'

const SECTIONS = [
  {
    label: 'Analytics',
    longName: 'Analytics',
    href: 'analytics',
    icon: BarChartIcon,
    description: 'View analytics',
  },
  {
    label: 'Users',
    longName: 'Browse users',
    href: 'users',
    icon: GroupIcon,
    description: 'Browse users data',
  },
  {
    label: 'Admin',
    longName: 'Administrators',
    href: 'admin',
    icon: AdminPanelSettingsIcon,
    description: 'You can invite other administators and change their rights',
  },
  {
    label: 'Games',
    longName: 'Manage games',
    href: 'games',
    description: 'Add more content to different games',
    icon: VideogameAssetIcon,
  },
  {
    label: 'Avatars',
    longName: 'Avatars',
    description: 'Create and manage avatar lists',
    href: 'avatars',
    icon: PetsIcon,
  },
  {
    label: 'Gifts',
    longName: 'Gifts',
    href: 'gifts',
    description: 'Manage gift calendar',
    icon: RedeemIcon,
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
    id: 'Editor',
    label: 'Editor',
    description: 'Editor can edit everything but admins or invite other admins',
  },
  {
    id: 'READER',
    label: 'Reader',
    description: 'Readers can only browse data but not modify',
  },
]

export { SECTIONS, RIGHTS }
