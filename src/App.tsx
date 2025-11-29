import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import StripeCheckout from "./components/StripeCheckout";
import CookieGallery from "./components/CookieGallery";
import CookieImage from "./components/CookieImage";
import AdminDashboard from "./components/AdminDashboard";
import AddressAutocomplete from "./components/AddressAutocomplete";
import Logo from "./components/Logo";
import { ShoppingCart } from "lucide-react";
import "./global.css";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--surface-1);
`;

const Header = styled.header`
  padding: 3rem 0;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  width: 100%;
  max-width: 16rem;
  rotate: -4.76deg;
  svg {
    width: 100%;
    height: auto;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const CartButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: background-color 0.3s ease;
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
  padding: 0 0 4rem 0;
`;

const HeroContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
`;

const HeroMain = styled.div``;
const HeroMedia = styled.div``;

const HeroTitle = styled.h2`
  rotate: -4.76deg;
  font-size: 3rem;
  color: var(--text-1);
  margin-bottom: 1.5rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-dark);
  margin-bottom: 2rem;
`;

const Schedule = styled.ul`
  font-size: 1rem;
  width: max-content;
  margin-inline: auto;
  display: grid;
  gap: 0.5rem;
  @media (min-width: 1024px) {
    width: auto;
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
  }
`;
const ScheduleItem = styled.li`
  text-align: left;
  display: flex;
  gap: 1rem;
  opacity: 0.8;
  padding: 0.5rem 1rem;
  &.today {
    outline: 3px solid transparent;
    outline-offset: 3px;
    opacity: 1;
  }
  &.orders {
    background-color: #22a91d;
    outline-color: #22a91d;
    color: white;
  }
  &.baking {
    background-color: #a9411d;
    outline-color: #a9411d;
    color: white;
  }
  &.pickup {
    background-color: #a91da4;
    outline-color: #a91da4;
    color: white;
  }
  @media (min-width: 1024px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
`;
const ScheduleItemDay = styled.span`
  font-weight: bold;
`;
const ScheduleItemDescription = styled.span`
  @media (min-width: 850px) {
    text-align: center;
    display: block;
  }
`;

const ProductsSection = styled.section`
  padding: 4rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  text-align: center;
  color: var(--text-1);
  margin-bottom: 3rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled.div`
  background-color: var(--surface-1);
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
  color: var(--text-1);
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
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  position: relative;

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
  color: var(--text-1);
  text-decoration: underline;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  &:hover {
    color: var(--secondary-color);
  }
`;

const DeliveryInfo = styled.div`
  background-color: var(--surface-1);
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
  background-color: var(--surface-1);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  @media (min-width: 1024px) {
    width: 98%;
    max-width: 1200px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--text-1);
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
  color: var(--text-1);
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
  margin-top: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-1);
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
    border-color: var(--text-1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioOption = styled.label`
  display: grid;
  align-items: start;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "input label"
    "input hint";
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
    border-color: var(--text-1);
    background-color: var(--surface-1);
  }
`;

const RadioInput = styled.input`
  grid-area: input;
  margin: 0.35rem 0 0 0;
  accent-color: var(--text-1);
`;

const RadioLabel = styled.span`
  grid-area: label;
  font-weight: 700;
  color: var(--text-dark);
  flex: 1;
`;
const RadioHint = styled.p`
  grid-area: hint;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-dark);
  opacity: 0.8;
`;

const SubmitButton = styled.button`
  background-color: var(--text-1);
  color: var(--text-2);
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

const WarningMessage = styled.div`
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-top: 1rem;
  color: #856404;

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }
`;
const products = [
  {
    id: 1,
    name: "Chocolate Chip Cookie",
    description: "The best chocolate chip cookie you will ever have.",
    price: 5.0,
    quantity: 1,
    packageType: "nibbler" as const,
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
  const [isAddressInRange, setIsAddressInRange] = useState<boolean | null>(
    null
  );
  const [selectedQuantity, setSelectedQuantity] = useState(5);

  const createOrder = useMutation(api.orders.createOrder);

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const getCurrentDay = () => {
    return new Date().getDay();
  };

  // Helper function to check if a day string matches today
  const isToday = (dayName: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayIndex = getCurrentDay();
    return days[currentDayIndex] === dayName;
  };

  if (currentView === "admin") {
    return <AdminDashboard />;
  }

  const addToCart = async (product: (typeof products)[0], quantity: number) => {
    setAddingToCart(product.id);

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantity }];
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

  const handleCreateOrder = async () => {
    if (cart.length === 0) return null;

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
      return orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
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

  const handleDirectCheckout = (product: (typeof products)[0], quantity: number) => {
    setCart([{ ...product, quantity }]);
    setCheckoutStep("cart");
    setIsCartOpen(true);
  };

  return (
    <AppContainer>
      <Header className="theme--a">
        <div className="container">
          <HeaderContent>
            <LogoContainer
              onClick={() => setCurrentView("store")}
              style={{ cursor: "pointer" }}
            >
              <Logo />
            </LogoContainer>
            <HeaderButtons>
              <AdminButton onClick={() => setCurrentView("admin")}>
                Admin
              </AdminButton>
              <CartButton onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={20} strokeWidth={2.5} />
                {getTotalItems() > 0 ? `Cart - $${getTotalPrice()}` : "Cart"}
                {getTotalItems() > 0 && (
                  <CartBadge>{getTotalItems()}</CartBadge>
                )}
              </CartButton>
            </HeaderButtons>
          </HeaderContent>
        </div>
      </Header>

      <Hero className="theme--a decorative--bottom-angled">
        <HeroContainer className="container">
          <HeroMain>
            <HeroTitle>
              <span className="text--highlighted">
                Meet Chef Jeff's World's Best Chocolate Chip Cookies
              </span>
            </HeroTitle>
            {/* <HeroSubtitle>
              <span className="text--highlighted">
                Hand-made, small-batch, the best chocolate chip cookie you will
                ever have.
              </span>
            </HeroSubtitle> */}
          </HeroMain>
          <HeroMedia>
            <img src="/images/hero-cookie.png" alt="Chocolate Chip Cookie" />
          </HeroMedia>
          {/* <Schedule>
            <ScheduleItem
              className={`orders delivery${isToday("Sunday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Sunday</ScheduleItemDay>
              <ScheduleItemDescription>
                Open&nbsp;for&nbsp;Orders &amp;&nbsp;Delivery
              </ScheduleItemDescription>
            </ScheduleItem>
            <ScheduleItem
              className={`orders${isToday("Monday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Monday</ScheduleItemDay>
              <ScheduleItemDescription>Open for Orders</ScheduleItemDescription>
            </ScheduleItem>
            <ScheduleItem
              className={`orders${isToday("Tuesday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Tuesday</ScheduleItemDay>
              <ScheduleItemDescription>Open for Orders</ScheduleItemDescription>
            </ScheduleItem>
            <ScheduleItem
              className={`orders${isToday("Wednesday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Wednesday</ScheduleItemDay>
              <ScheduleItemDescription>Open for Orders</ScheduleItemDescription>
            </ScheduleItem>
            <ScheduleItem
              className={`baking${isToday("Thursday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Thursday</ScheduleItemDay>
              <ScheduleItemDescription>Baking</ScheduleItemDescription>
            </ScheduleItem>
            <ScheduleItem
              className={`baking${isToday("Friday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Friday</ScheduleItemDay>
              <ScheduleItemDescription>Baking</ScheduleItemDescription>
            </ScheduleItem>
            <ScheduleItem
              className={`pickup${isToday("Saturday") ? " today" : ""}`}
            >
              <ScheduleItemDay>Saturday</ScheduleItemDay>
              <ScheduleItemDescription>Pickup</ScheduleItemDescription>
            </ScheduleItem>
          </Schedule> */}
        </HeroContainer>
      </Hero>

      <ProductsSection>
        <div className="container">
          <SectionTitle>Our Cookie Packages</SectionTitle>
          <ProductGrid>
            {products.map((product) => {
              const quantityInCart = getItemQuantityInCart(product.id);
              const isAdding = addingToCart === product.id;
              const currentPrice = product.price * selectedQuantity;

              return (
                <ProductCard key={product.id} style={{ maxWidth: "500px", margin: "0 auto" }}>
                  <CookieGallery packageType={product.packageType} />
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  
                  <div style={{ margin: "1.5rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <Label htmlFor="quantity-select" style={{ marginBottom: 0 }}>Select Quantity:</Label>
                    <select
                      id="quantity-select"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                      style={{
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "var(--border-radius)",
                        border: "2px solid #ddd",
                        width: "100%",
                        maxWidth: "200px"
                      }}
                    >
                      <option value={5}>5 Cookies ($25.00)</option>
                      <option value={10}>10 Cookies ($50.00)</option>
                      <option value={15}>15 Cookies ($75.00)</option>
                      <option value={20}>20 Cookies ($100.00)</option>
                      <option value={25}>25 Cookies ($125.00)</option>
                    </select>
                  </div>

                  <SubmitButton
                    onClick={() => handleDirectCheckout(product, selectedQuantity)}
                    style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                  >
                    Checkout - ${currentPrice.toFixed(2)}
                  </SubmitButton>
                </ProductCard>
              );
            })}
          </ProductGrid>

          <DeliveryInfo>
            <h4 style={{ color: "var(--text-1)", marginBottom: "1rem" }}>
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
          <ModalContent className="theme--b">
            <ModalHeader>
              <ModalTitle>
                {checkoutStep === "cart" && "Your Cart"}
                {checkoutStep === "details" && "Checkout"}
                {checkoutStep === "success" && "Order Complete"}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            {checkoutStep === "success" ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <h4
                  style={{
                    color: "var(--text-1)",
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
            ) : checkoutStep === "details" ? (
              <div>
                <button
                  onClick={goBackToCart}
                  style={{
                    background: "none",
                    color: "var(--text-1)",
                    marginBottom: "1rem",
                    textDecoration: "underline",
                  }}
                >
                  ← Back to cart
                </button>

                <div
                  style={{
                    backgroundColor: "var(--surface-1)",
                    padding: "1rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      color: "var(--text-1)",
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
                      color: "var(--text-1)",
                    }}
                  >
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </SummaryRow>
                </div>

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

                <StripeCheckout
                  amount={getTotalPrice()}
                  customerEmail={orderForm.customerEmail}
                  customerName={orderForm.customerName}
                  onSuccess={handlePaymentSuccess}
                  onCreateOrder={handleCreateOrder}
                />
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

                          <CartItemSubtotal>
                            ${(item.price * item.quantity).toFixed(2)}
                          </CartItemSubtotal>
                        </CartItemInfo>
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          style={{
                            padding: "0.5rem",
                            fontSize: "1rem",
                            borderRadius: "var(--border-radius)",
                            border: "2px solid #ddd",
                            cursor: "pointer"
                          }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                          <option value={25}>25</option>
                        </select>
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
                            <RadioHint>
                              Saturdays from Noon - 4 PM in Stamford, CT
                              <br /> at the Danger Gallery
                              <br />
                              <a
                                href="https://www.google.com/maps/place/Danger+Gallery/@41.0754056,-73.5212585,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2a1add5015f11:0xc93c1e07e6b83389!8m2!3d41.0754056!4d-73.5186782!16s%2Fg%2F11c5fzl55c?entry=ttu&g_ep=EgoyMDI1MTExMS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                              >
                                652 Glenbrook Rd #3, Stamford, CT 06906
                              </a>
                            </RadioHint>
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
                            <RadioHint>
                              Sunday Deliveries
                              <br /> within 5 miles of Stamford, CT
                            </RadioHint>
                          </RadioOption>
                        </RadioGroup>
                      </FormGroup>

                      {orderForm.deliveryType === "delivery" && (
                        <FormGroup>
                          <Label style={{ marginTop: "2rem" }}>
                            Delivery Address *
                          </Label>
                          <AddressAutocomplete
                            required
                            value={orderForm.deliveryAddress}
                            onChange={(value) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                deliveryAddress: value,
                              }))
                            }
                            onDeliveryStatusChange={setIsAddressInRange}
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
                      disabled={
                        cart.length === 0 ||
                        (orderForm.deliveryType === "delivery" &&
                          isAddressInRange === false)
                      }
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
