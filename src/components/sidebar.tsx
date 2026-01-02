// src/components/sidebar.tsx

'use client'

import { useState } from 'react'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse
} from '@mui/material'
import Link from 'next/link'
import {
  ExpandLess,
  ExpandMore,
  Inventory2,
  Article,
  Settings
} from '@mui/icons-material'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import HomeIcon from '@mui/icons-material/Home'
import StyleIcon from '@mui/icons-material/Style'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import QuizIcon from '@mui/icons-material/Quiz'
import RateReviewIcon from '@mui/icons-material/RateReview'
import LogoutButton from '@/components/logout-button'
import { usePathname } from 'next/navigation' // Thêm hook này

export default function Sidebar() {
  const pathname = usePathname() // Lấy pathname hiện tại
  const initialOpenGroups = ['Dữ liệu', 'Hệ thống']
  const [openGroups, setOpenGroups] = useState<string[]>(initialOpenGroups)

  const handleToggle = (group: string) => {
    setOpenGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    )
  }

  const menuItems = [
    {
      group: 'Dữ liệu',
      icon: <Settings />,
      items: [
        { text: 'Trang chủ', path: '/', icon: <HomeIcon /> },
        { text: 'Sản phẩm', path: '/products', icon: <Inventory2 /> },
        {
          text: 'Thuộc tính',
          path: '/attributes',
          icon: <CollectionsBookmarkIcon />
        },
        { text: 'Tin tức', path: '/posts', icon: <Article /> },
        { text: 'Dịch vụ', path: '/services', icon: <HomeRepairServiceIcon /> },
        { text: 'Chuyên mục', path: '/menus', icon: <StyleIcon /> },
        { text: 'Đơn hàng', path: '/invoices', icon: <LocalShippingIcon /> },
        { text: 'Mã khuyến mãi', path: '/coupons', icon: <PriceChangeIcon /> },
        { text: 'FAQ', path: '/faqs', icon: <QuizIcon /> },
        { text: 'Đánh giá', path: '/reviews', icon: <RateReviewIcon /> }
      ]
    }
  ]

  return (
    <div className='w-64 h-screen fixed flex flex-col justify-between shadow-lg'>
      <List component='nav'>
        {menuItems.map(group => (
          <div key={group.group}>
            <ListItemButton onClick={() => handleToggle(group.group)}>
              <ListItemIcon>{group.icon}</ListItemIcon>
              <ListItemText primary={group.group} />
              {openGroups.includes(group.group) ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>

            <Collapse
              in={openGroups.includes(group.group)}
              timeout='auto'
              unmountOnExit>
              <List component='div' disablePadding>
                {group.items.map(item => {
                  // Kiểm tra xem item này có active không
                  const isActive =
                    pathname === item.path ||
                    (item.path !== '/' && pathname.startsWith(item.path))

                  return (
                    <Link key={item.text} href={item.path} passHref>
                      <ListItemButton
                        selected={isActive} // Sử dụng prop selected của MUI
                        sx={{
                          pl: 4,
                          // Tùy chỉnh style khi active
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark'
                            }
                          }
                        }}>
                        <ListItemIcon
                          sx={{ color: isActive ? 'white' : 'inherit' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{ color: isActive ? 'white' : 'inherit' }}
                        />
                      </ListItemButton>
                    </Link>
                  )
                })}
              </List>
            </Collapse>
            <Divider />
          </div>
        ))}
      </List>

      <div className='p-4'>
        <LogoutButton />
      </div>
    </div>
  )
}
