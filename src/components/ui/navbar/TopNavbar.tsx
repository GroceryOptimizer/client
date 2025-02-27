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
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@heroui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { StoreInventory, VendorVisitDTO } from '~/models/v1';
import { useCartStore } from '~/stores';
import { useResultStore } from '~/stores/resultStore';
import { mapStoreInventory } from '~/utils/mappers';

export default function TopNavbar(): ReactElement {
  const cart = useCartStore((state) => state.cart);
  const { add: addResult, clear: clearResult, stores: results } = useResultStore();
  const router = useRouter();

  const clearCart = () => {
    console.log("Clearing cart");
    useCartStore.setState({ cart: [] });
  };

  const sendCart = async () => {
    const postCart = { cart: cart.map((x) => ({ name: x.product.name })) }
    const res = await axios.post('http://localhost:7049/api/cart', postCart, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(res.data);

    clearResult();
    res.data.map(mapStoreInventory).forEach(addResult);

    router.push('/optimize');
    return res.data;
  }

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
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Cart {cart.length > 0 && `(${cart.length})`}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" >
              <DropdownSection items={cart}>
                {(item) => (
                  <DropdownItem
                    key={Math.random()}
                  >
                    {item.product.name}
                  </DropdownItem>
                )}
              </DropdownSection>
              <DropdownSection>
                <DropdownItem key={Math.random()}><span onClick={() => clearCart()}>Clear</span></DropdownItem>
                <DropdownItem key={Math.random()}><span onClick={async () => await sendCart()}>Send</span></DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
