import { Popover, Button, Text, Stack, Group, Image, Badge, Divider } from '@mantine/core';
import { IconShoppingCart, IconPlus, IconMinus } from '@tabler/icons-react';
import type { CartItem } from '../../types/product';
import classes from './CartPopover.module.css';
import Cart from '../../public/cart_empty.svg'

interface CartPopoverProps {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  onRemoveItem: (id: number) => void;
  onQtyChange: (id: number, delta: number) => void;
}


export const CartPopover = ({
  cartItems,
  totalItems,
  totalPrice,
  onRemoveItem,
  onQtyChange,
}: CartPopoverProps) => {
  return (
    <Popover position="bottom-end" shadow="md" width={300}>
      <Popover.Target>
        <Button rightSection={<IconShoppingCart size={18} />} color="#54b46a" variant="filled">
        {totalItems > 0 ? (
          <Group gap="xs" align="center">
            <Badge
              size="sm"
              radius="xl"
              color="white"
              c="#54b46a"
              fw={700}
              className={classes.badgeCircle}
            >
              {totalItems}
            </Badge>
            <span>Cart</span>
          </Group>
          ) : (
          <span>Cart</span>
        )}
        </Button>
      </Popover.Target>
      
      <Popover.Dropdown className={classes.popover}>
        {cartItems.length === 0 ? (
          <div>
            <img src={Cart}/>
            <Text c="dimmed" className={classes.emptyText}>
              Your cart is empty!
            </Text>
          </div>
        ) : (
          <Stack gap="md">
            <Stack gap="sm">
              {cartItems.map(({ product, quantity }) => {
                const [name, weight] = product.name.split('-');
                const itemTotalPrice = product.price * quantity;

                return (
                  <div key={product.id}>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <Image src={product.image} w={45} h={45} fit="contain" alt={product.name} />
                        <div>
                          <Group gap="6" align="baseline">
                            <Text size="sm" fw={700} c="dark">
                              {name}
                            </Text>
                            {weight && (
                              <Text size="xs" c="dimmed" fw={500}>
                                {weight}
                              </Text>
                            )}
                          </Group>
                          <Text size="md" fw={700} c="dark" mt={2}>
                            $ {itemTotalPrice}
                          </Text>
                        </div>
                      </Group>

                      <Group gap="4" align="center" mt={4}>
                        <Badge
                          variant="light"
                          color="grey"
                          c="dark"
                          size="sm"
                          radius="sm"
                          className={classes.qtyBadge}
                          onClick={() => {
                            if (quantity === 1) {
                              onRemoveItem(product.id);
                            } else {
                              onQtyChange(product.id, -1);
                            }
                          }}
                        >
                          <IconMinus size={10} stroke={3} />
                        </Badge>

                        <Text size="sm" fw={600} className={classes.quantityText}>
                          {quantity}
                        </Text>

                        <Badge
                          variant="light"
                          color="grey"
                          c="dark"
                          size="sm"
                          radius="sm"
                          className={classes.qtyBadge}
                          onClick={() => onQtyChange(product.id, 1)}
                        >
                          <IconPlus size={10} stroke={3} />
                        </Badge>
                      </Group>
                    </Group>
                    <Divider mt="sm" color="#e9ecef" />
                  </div>
                );
              })}
            </Stack>

            <Group justify="space-between" align="center" pt={4}>
              <Text size="md" fw={700} c="dark">
                Total
              </Text>
              <Text size="lg" fw={700} c="dark">
                $ {totalPrice}
              </Text>
            </Group>
          </Stack>
        )}
      </Popover.Dropdown>
    </Popover>
  );
};
