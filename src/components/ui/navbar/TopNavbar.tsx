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
              <DropdownSection className='flex flex-col items-center'>
                <DropdownItem key={Math.random()}><span className="bg-red-300 border border-red-500 px-10 py-1 rounded-md" onClick={() => clearCart()}>Clear</span></DropdownItem>
                <DropdownItem key={Math.random()}><span className="bg-green-300 border border-green-500 px-10 py-1 rounded-md" onClick={async () => await sendCart()}>Send</span></DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
