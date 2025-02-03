'use client';

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/react';
import { ReactElement } from 'react';

export default function TopNavbar(): ReactElement {
  return (
    <Navbar>
      <NavbarContent>
        <NavbarItem>
          <Link>Shop</Link>
        </NavbarItem>
        <NavbarItem>
          <Link>Store</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link>Cart</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
