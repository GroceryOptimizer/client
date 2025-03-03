import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Badge,
} from '@heroui/react';
import { ReactElement } from 'react';
import { CartItem } from '~models';
import { ShoppingCart as CartIcon, X as CloseIcon } from 'lucide-react';

interface Props {
    cart: CartItem[];
    clear: () => void;
    send: () => void;
}

export default function CartDropDown({ cart, clear, send }: Props): ReactElement {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button color="primary" href="#" variant="flat" radius="full">
                    <Badge
                        color="danger"
                        content={cart.length}
                        placement="top-right"
                        isInvisible={cart.length === 0}
                    >
                        <CartIcon />
                    </Badge>
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions">
                <DropdownSection items={cart} showDivider>
                    {(item) => (
                        <DropdownItem
                            key={Math.random()}
                            endContent={<CloseIcon className="text-large" />}
                        >
                            <div className="flex flex-row justify-between items-center gap-x-2">
                                <div>{item.product.name} </div>
                            </div>
                        </DropdownItem>
                    )}
                </DropdownSection>
                <DropdownSection className="flex flex-col items-center">
                    <DropdownItem key="clear-cart" className="text-danger" onPress={clear}>
                        Clear
                    </DropdownItem>
                    <DropdownItem key="send-cart" className="text-success" onPress={send}>
                        Send
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
}
