import {
  ChatAltIcon,
  CogIcon,
  LogoutIcon,
  ShoppingCartIcon,
  TemplateIcon,
  UserIcon,
} from '@heroicons/react/outline'

export const navLinks = [
  {
    id: 0,
    title: 'Users',
    icon: <TemplateIcon className="nav-icon" />,
  },
  {
    id: 1,
    title: 'Products',
    icon: <ShoppingCartIcon className="nav-icon" />,
  },
  {
    id: 2,
    title: 'Orders',
    icon: <UserIcon className="nav-icon" />,
  },
  {
    id: 3,
    title: 'Comments',
    icon: <ChatAltIcon className="nav-icon" />,
  },
  {
    id: 4,
    title: 'Settings',
    icon: <CogIcon className="nav-icon" />,
  },
  {
    id: 5,
    title: 'LogOut',
    icon: <LogoutIcon className="nav-icon" />,
  },
]
