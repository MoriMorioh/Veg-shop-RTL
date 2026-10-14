import { Group, Title, Badge } from '@mantine/core';
import type { CartItem } from '../../types/product';
import classes from './Header.module.css';
import { CartPopover } from './CartPopover';

interface HeaderProps {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  onRemoveItem: (id: number) => void;
  onQtyChange: (id: number, delta: number) => void;
}

export const Header = ({
  cartItems,
  totalItems,
  totalPrice,
  onRemoveItem,
  onQtyChange,
}: HeaderProps) => {
  return (
    <header className={classes.header}>
      <Group justify="space-between" align="center" className={classes.container}>
        <Group gap="xs">
          <Title order={3}>Vegetable</Title>
          <Badge color="#54b46a" variant="filled">
            SHOP
          </Badge>
        </Group>

        <CartPopover
          cartItems={cartItems}
          totalItems={totalItems}
          totalPrice={totalPrice}
          onRemoveItem={onRemoveItem}
          onQtyChange={onQtyChange}
        />
      </Group>
    </header>
  );
};
