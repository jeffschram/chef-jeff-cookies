import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import StripeCheckout from "./components/StripeCheckout";
import CookieGallery from "./components/CookieGallery";
import CookieImage from "./components/CookieImage";
import AdminDashboard from "./components/AdminDashboard";
import "./global.css";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background-light);
`;

const Header = styled.header`
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 1rem 0;
  box-shadow: var(--shadow);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const CartButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-light);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  position: relative;

  &:hover {
    background-color: var(--accent-color);
  }
`;

const AdminButton = styled.button`
  background-color: var(--accent-color);
  color: var(--text-dark);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e6c068;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 0;
  background-color: var(--background-white);
`;

const HeroTitle = styled.h2`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-dark);
  margin-bottom: 2rem;
`;

const Schedule = styled.div`
  background-color: var(--accent-color);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-lg);
  display: inline-block;
  margin-bottom: 2rem;
`;

const ProductsSection = styled.section`
  padding: 4rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 3rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled.div`
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const ProductName = styled.h4`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: var(--text-dark);
  margin-bottom: 1rem;
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
`;

const AddToCartButton = styled.button`
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  position: relative;

  &:hover:not(:disabled) {
    background-color: var(--secondary-color);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ProductBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ViewCartLink = styled.button`
  background: none;
  color: var(--primary-color);
  text-decoration: underline;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  &:hover {
    color: var(--secondary-color);
  }
`;

const DeliveryInfo = styled.div`
  background-color: var(--background-white);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--primary-color);
`;

const CloseButton = styled.button`
  background: none;
  font-size: 1.5rem;
  color: var(--text-dark);
  padding: 0.5rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  gap: 1rem;
`;

const CartItemImage = styled.div`
  flex-shrink: 0;
`;

const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemName = styled.p`
  font-weight: bold;
  color: var(--primary-color);
`;

const CartItemPrice = styled.p`
  color: var(--text-dark);
`;

const CartItemSubtotal = styled.p`
  font-weight: bold;
  color: var(--secondary-color);
  font-size: 1.1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background-color: var(--accent-color);
  color: var(--text-dark);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: bold;
`;

const CartSummary = styled.div`
  border-top: 2px solid #eee;
  padding-top: 1rem;
  margin: 1rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 1rem;
`;

const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 2px solid var(--primary-color);
  margin-top: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-color);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-dark);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;

  &:focus {
    border-color: var(--primary-color);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
    background-color: #fafafa;
  }

  &:has(input:checked) {
    border-color: var(--primary-color);
    background-color: var(--background-light);
  }
`;

const RadioInput = styled.input`
  margin: 0;
  accent-color: var(--primary-color);
`;

const RadioLabel = styled.span`
  font-weight: 500;
  color: var(--text-dark);
  flex: 1;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: var(--primary-color);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--secondary-color);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.p`
  text-align: center;
  color: var(--text-dark);
  font-style: italic;
  margin: 2rem 0;
`;

const products = [
  {
    id: 1,
    name: "The Nibbler",
    description: "Perfect for a quick treat",
    price: 15,
    quantity: 3,
    packageType: "nibbler" as const,
  },
  {
    id: 2,
    name: "Family Pack",
    description: "Great for sharing with loved ones",
    price: 27,
    quantity: 6,
    packageType: "family" as const,
  },
  {
    id: 3,
    name: "The Pro",
    description: "For serious cookie enthusiasts",
    price: 50,
    quantity: 12,
    packageType: "pro" as const,
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  packageType?: "nibbler" | "family" | "pro";
}

interface OrderForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "pickup" | "delivery";
  deliveryAddress: string;
}

type CheckoutStep = "cart" | "details" | "payment" | "success";
type AppView = "store" | "admin";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("store");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [currentOrderId, setCurrentOrderId] = useState<Id<"orders"> | null>(
    null
  );
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryType: "pickup",
    deliveryAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const createOrder = useMutation(api.orders.createOrder);

  if (currentView === "admin") {
    return <AdminDashboard />;
  }

  const addToCart = async (product: (typeof products)[0]) => {
    setAddingToCart(product.id);

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setAddingToCart(null);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantityInCart = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const deliveryFee = orderForm.deliveryType === "delivery" ? 10 : 0;
    return subtotal + deliveryFee;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        customerPhone: orderForm.customerPhone,
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryType: orderForm.deliveryType,
        deliveryAddress:
          orderForm.deliveryType === "delivery"
            ? orderForm.deliveryAddress
            : undefined,
        totalAmount: getTotalPrice(),
      });

      setCurrentOrderId(orderId);
      setCheckoutStep("payment");
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCheckoutStep("success");
    setCart([]);
    setOrderForm({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryType: "pickup",
      deliveryAddress: "",
    });
  };

  const closeModal = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
    setCurrentOrderId(null);
  };

  const goBackToCart = () => {
    setCheckoutStep("cart");
  };

  const goBackToDetails = () => {
    setCheckoutStep("details");
  };

  return (
    <AppContainer>
      <Header>
        <div className="container">
          <HeaderContent>
            <Logo
              onClick={() => setCurrentView("store")}
              style={{ cursor: "pointer" }}
            >
              Chef Jeff Cookies
            </Logo>
            <HeaderButtons>
              <AdminButton onClick={() => setCurrentView("admin")}>
                Admin
              </AdminButton>
              <CartButton onClick={() => setIsCartOpen(true)}>
                {getTotalItems() > 0 ? `Cart - $${getTotalPrice()}` : "Cart"}
                {getTotalItems() > 0 && (
                  <CartBadge>{getTotalItems()}</CartBadge>
                )}
              </CartButton>
            </HeaderButtons>
          </HeaderContent>
        </div>
      </Header>

      <Hero>
        <div className="container">
          <HeroTitle>Freshly Baked Every Wednesday</HeroTitle>
          <HeroSubtitle>
            Handcrafted cookies made with love and the finest ingredients
          </HeroSubtitle>
          <Schedule>
            <strong>Baked: Fridays | Pickup: Saturdays</strong>
          </Schedule>
        </div>
      </Hero>

      <ProductsSection>
        <div className="container">
          <SectionTitle>Our Cookie Packages</SectionTitle>
          <ProductGrid>
            {products.map((product) => {
              const quantityInCart = getItemQuantityInCart(product.id);
              const isAdding = addingToCart === product.id;

              return (
                <ProductCard key={product.id}>
                  <CookieGallery packageType={product.packageType} />
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductDescription>
                    {product.quantity} cookies
                  </ProductDescription>
                  <ProductPrice>${product.price}</ProductPrice>
                  <AddToCartButton
                    onClick={() => addToCart(product)}
                    disabled={isAdding}
                  >
                    {isAdding
                      ? "Adding..."
                      : quantityInCart > 0
                        ? "Add Another"
                        : "Add to Cart"}
                    {quantityInCart > 0 && !isAdding && (
                      <ProductBadge>{quantityInCart}</ProductBadge>
                    )}
                  </AddToCartButton>
                  {quantityInCart > 0 && (
                    <div>
                      <ViewCartLink onClick={() => setIsCartOpen(true)}>
                        View Cart
                      </ViewCartLink>
                    </div>
                  )}
                </ProductCard>
              );
            })}
          </ProductGrid>

          <DeliveryInfo>
            <h4 style={{ color: "var(--primary-color)", marginBottom: "1rem" }}>
              Delivery Information
            </h4>
            <p>
              <strong>Pickup:</strong> Free on Saturdays
              <br />
              <strong>Local Delivery:</strong> Additional $10 fee
            </p>
          </DeliveryInfo>
        </div>
      </ProductsSection>

      {isCartOpen && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {checkoutStep === "cart" && "Your Cart"}
                {checkoutStep === "details" && "Customer Information"}
                {checkoutStep === "payment" && "Payment"}
                {checkoutStep === "success" && "Order Complete"}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            {checkoutStep === "success" ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <h4
                  style={{
                    color: "var(--primary-color)",
                    marginBottom: "1rem",
                  }}
                >
                  🎉 Order Confirmed!
                </h4>
                <p>
                  Thank you for your order! We'll contact you soon with
                  pickup/delivery details.
                </p>
              </div>
            ) : checkoutStep === "payment" && currentOrderId ? (
              <div>
                <button
                  onClick={goBackToDetails}
                  style={{
                    background: "none",
                    color: "var(--primary-color)",
                    marginBottom: "1rem",
                    textDecoration: "underline",
                  }}
                >
                  ← Back to details
                </button>
                <StripeCheckout
                  orderId={currentOrderId}
                  amount={getTotalPrice()}
                  customerEmail={orderForm.customerEmail}
                  customerName={orderForm.customerName}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            ) : checkoutStep === "details" ? (
              <div>
                <button
                  onClick={goBackToCart}
                  style={{
                    background: "none",
                    color: "var(--primary-color)",
                    marginBottom: "1rem",
                    textDecoration: "underline",
                  }}
                >
                  ← Back to cart
                </button>

                <Form onSubmit={handleSubmitOrder}>
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input
                      type="text"
                      required
                      value={orderForm.customerName}
                      onChange={(e) =>
                        setOrderForm((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      required
                      value={orderForm.customerEmail}
                      onChange={(e) =>
                        setOrderForm((prev) => ({
                          ...prev,
                          customerEmail: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Phone *</Label>
                    <Input
                      type="tel"
                      required
                      value={orderForm.customerPhone}
                      onChange={(e) =>
                        setOrderForm((prev) => ({
                          ...prev,
                          customerPhone: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>

                  <div
                    style={{
                      backgroundColor: "var(--background-light)",
                      padding: "1rem",
                      borderRadius: "var(--border-radius)",
                      marginTop: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        color: "var(--primary-color)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Order Summary
                    </h4>
                    <SummaryRow>
                      <span>Subtotal:</span>
                      <span>
                        $
                        {cart
                          .reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </SummaryRow>
                    {orderForm.deliveryType === "delivery" && (
                      <SummaryRow>
                        <span>Delivery Fee:</span>
                        <span>$10.00</span>
                      </SummaryRow>
                    )}
                    <SummaryRow
                      style={{
                        fontWeight: "bold",
                        color: "var(--primary-color)",
                      }}
                    >
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </SummaryRow>
                  </div>

                  <SubmitButton
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                  >
                    {isSubmitting ? "Creating Order..." : "Proceed to Payment"}
                  </SubmitButton>
                </Form>
              </div>
            ) : (
              <>
                {cart.length === 0 ? (
                  <EmptyCart>Your cart is empty</EmptyCart>
                ) : (
                  <>
                    {cart.map((item) => (
                      <CartItem key={item.id}>
                        <CartItemImage>
                          <CookieImage
                            packageType={item.packageType || "nibbler"}
                            variant={0}
                            size={50}
                          />
                        </CartItemImage>
                        <CartItemInfo>
                          <CartItemName>{item.name}</CartItemName>
                          <CartItemPrice>${item.price} each</CartItemPrice>
                          <CartItemSubtotal>
                            ${(item.price * item.quantity).toFixed(2)}
                          </CartItemSubtotal>
                        </CartItemInfo>
                        <QuantityControls>
                          <QuantityButton
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </QuantityButton>
                          <span>{item.quantity}</span>
                          <QuantityButton
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </QuantityButton>
                        </QuantityControls>
                      </CartItem>
                    ))}

                    <CartSummary>
                      <FormGroup>
                        <Label>Delivery Option *</Label>
                        <RadioGroup>
                          <RadioOption>
                            <RadioInput
                              type="radio"
                              name="deliveryType"
                              value="pickup"
                              checked={orderForm.deliveryType === "pickup"}
                              onChange={() =>
                                setOrderForm((prev) => ({
                                  ...prev,
                                  deliveryType: "pickup",
                                }))
                              }
                            />
                            <RadioLabel>Pickup (Free)</RadioLabel>
                          </RadioOption>
                          <RadioOption>
                            <RadioInput
                              type="radio"
                              name="deliveryType"
                              value="delivery"
                              checked={orderForm.deliveryType === "delivery"}
                              onChange={() =>
                                setOrderForm((prev) => ({
                                  ...prev,
                                  deliveryType: "delivery",
                                }))
                              }
                            />
                            <RadioLabel>Local Delivery (+$10)</RadioLabel>
                          </RadioOption>
                        </RadioGroup>
                      </FormGroup>

                      {orderForm.deliveryType === "delivery" && (
                        <FormGroup>
                          <Label>Delivery Address *</Label>
                          <TextArea
                            required
                            value={orderForm.deliveryAddress}
                            onChange={(e) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                deliveryAddress: e.target.value,
                              }))
                            }
                            placeholder="Enter your full delivery address"
                          />
                        </FormGroup>
                      )}

                      {orderForm.deliveryType === "delivery" ? (
                        <>
                          <SummaryRow>
                            <span>Subtotal:</span>
                            <span>
                              $
                              {cart
                                .reduce(
                                  (total, item) =>
                                    total + item.price * item.quantity,
                                  0
                                )
                                .toFixed(2)}
                            </span>
                          </SummaryRow>
                          <SummaryRow>
                            <span>Delivery Fee:</span>
                            <span>$10.00</span>
                          </SummaryRow>
                          <GrandTotal>
                            <span>Total:</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                          </GrandTotal>
                        </>
                      ) : (
                        <GrandTotal>
                          <span>Total:</span>
                          <span>${getTotalPrice().toFixed(2)}</span>
                        </GrandTotal>
                      )}
                    </CartSummary>

                    <SubmitButton
                      onClick={() => setCheckoutStep("details")}
                      disabled={cart.length === 0}
                    >
                      Continue to Checkout
                    </SubmitButton>
                  </>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </AppContainer>
  );
}
