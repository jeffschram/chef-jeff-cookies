import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import StripeCheckout from "./components/StripeCheckout";
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
  padding: 1rem 0;
  @media (min-width: 46em) {
    padding: 3rem 0 3rem;
  }
  @media (min-width: 64em) {
    padding: 3rem 0 0;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  width: 100%;  
  max-width: 8rem;
  svg {
    width: 100%;
    height: auto;
  }
  @media (min-width: 46em) {
    max-width: 16rem;
  }
  @media (min-width: 64em) {
    rotate: -4.76deg;
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

const AdminButton = styled.a`
  color: var(--text-1);
  
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
  padding: 2rem 0;
  @media (min-width: 46em) {
    padding: 0 0 2rem;
  }
  @media (min-width: 64em) {
    padding: 0 0 4rem;
  }
`;

const HeroContainer = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 64em) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
`;

const HeroMain = styled.div`
  @media (min-width: 64em) {
    rotate: -4.76deg;
  }
`;
const HeroMedia = styled.div`
  display: none;
  @media (min-width: 64em) {
    display: block;
  }
`;

const HeroTitle = styled.h2`
  font-size: 2.25rem;
  @media (min-width: 46em) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-top: 2rem;
`;

const ProductsSection = styled.section`
  padding: 2rem 0;
  @media (min-width: 46em) {
    padding: 4rem 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  text-align: center;
  color: var(--text-1);
  margin-bottom: 3rem;
`;

const ProductCard = styled.div`
`;

const ProductContent = styled.div`
position: relative;
display: grid;
gap: 2rem;
padding: 1.5rem;
border: 1px solid var(--text-1);
border-radius: 0.25rem;
&::after {
  top: 100%;
  height: 1rem;
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  background: #333;
  border-radius: 0 0 0.25rem 0.25rem;
}
    @media (min-width: 46em) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
`;

const ProductMedia = styled.div`
border: 1px solid var(--text-1);
  
`;

const ProductMain = styled.div``;

const ProductName = styled.h4`
  font-size: 1.5rem;
  color: var(--text-1);
  margin-bottom: 0.5rem;
  @media (min-width: 46em) {
    font-size: 2rem;
  }
    @media (min-width: 64em) {
    font-size: 2.5rem;
}
`;

const ProductDescription = styled.p`
  color: var(--text-dark);
  margin-bottom: 1rem;
`;

const Feature = styled.div`
  padding: 2rem 0;
 @media (min-width: 46em) {
   padding: 4rem 0;
  }
`;


const FeatureContent = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 46em) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
  }
`;

const FeatureMain = styled.div``;

const FeatureMedia = styled.div``;

const FeatureTitle = styled.h4`
  font-size: 1.5rem;
  color: var(--text-1);
  margin-bottom: 1rem;
  @media (min-width: 46em) {
    font-size: 2rem;
  }
    @media (min-width: 64em) {
    font-size: 2.5rem;
}
`;

const FeatureDescription = styled.p`
  color: var(--text-dark);
  line-height: 1.5;
  margin-bottom: 1rem;
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
  max-height: 99vh;
  overflow-y: auto;
  @media (min-width: 1024px) {
    max-height: 90vh;
    width: 98%;
    max-width: 800px;
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
  display: grid;
  grid-template-columns: 5rem 1fr auto;
  align-items: start;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  gap: 1rem;
  @media (min-width: 46em) {
    grid-template-columns: 10rem 1fr auto;
  }
`;

const CartItemImage = styled.div`
`;

const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemName = styled.p`
  font-weight: bold;
  color: var(--text-1);
`;


const CartItemSubtotal = styled.p`
  margin-top: 1rem;
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

const Footer = styled.footer`
  padding: 3rem 0;
`;

const FooterContent = styled.div`
  
`;

const FooterText = styled.p`
  color: var(--text-dark);
  font-size: 0.9rem;
  margin-bottom: 1rem;
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
    name: "Chef Jeff's World's Best* Chocolate Chip Cookie",
    description: "The best chocolate chip cookie you will ever have.",
    price: 5.0,
    available: true,
    defaultImage: "chocolate-chip-5.png",
    images: {
      5: "chocolate-chip-5.png",
      10: "chocolate-chip-10.png",
      15: "chocolate-chip-15.png",
      20: "chocolate-chip-20.png",
      25: "chocolate-chip-25.png"
    }
  },
  {
    id: 2,
    name: "Oatmeal Raisin Cookie",
    description: "A classic favorite with plump raisins and oats.",
    price: 5.0,
    available: false,
    defaultImage: "oatmeal-raisin-5.png",
    images: {
      5: "oatmeal-raisin-5.png",
      10: "oatmeal-raisin-10.png",
      15: "oatmeal-raisin-15.png",
      20: "oatmeal-raisin-20.png",
      25: "oatmeal-raisin-25.png"
    }
  },
];

interface ProductDisplayProps {
  product: (typeof products)[0];
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onViewCart: () => void;
}

function ProductDisplay({
  product,
  quantity,
  onUpdateQuantity,
  onViewCart,
}: ProductDisplayProps) {
  return (
    <ProductCard>
      <div className="container">
        <ProductContent>
          <ProductMedia>
            <CookieImage product={product} quantity={quantity} />
          </ProductMedia>
          <ProductMain>
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
            <div>
              <Label htmlFor={`quantity-select-${product.id}`} className="visually-hidden">
                Select Quantity:
              </Label>
              <select
                id={`quantity-select-${product.id}`}
                value={quantity}
                onChange={(e) => onUpdateQuantity(Number(e.target.value))}
                style={{
                  padding: "0.5rem",
                  fontSize: "1rem",
                  borderRadius: "var(--border-radius)",
                  border: "2px solid #ddd",
                  width: "100%",
                  maxWidth: "200px",
                }}
              >
                <option value={0}>Select Quantity</option>
                <option value={5}>5 Cookies ($25.00)</option>
                <option value={10}>10 Cookies ($50.00)</option>
                <option value={15}>15 Cookies ($75.00)</option>
                <option value={20}>20 Cookies ($100.00)</option>
                <option value={25}>25 Cookies ($125.00)</option>
              </select>
            </div>

            {quantity > 0 && (
              <SubmitButton
              onClick={onViewCart}
              >
                View Cart
              </SubmitButton>
            )}
            </ProductMain>
          </ProductContent>
      </div>
    </ProductCard>
  );
}

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

  const setCartQuantity = (product: (typeof products)[0], quantity: number) => {
    if (quantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity } : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
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
      <div className="theme--a decorative--inset-border">
      <Header>
        <div className="container">
          <HeaderContent>
            <LogoContainer
              onClick={() => setCurrentView("store")}
              style={{ cursor: "pointer" }}
            >
              <h1 className="visually-hidden">Chef Jeff's Cookies</h1>
              <Logo />
            </LogoContainer>
            <HeaderButtons>
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

      <Hero>
        <HeroContainer className="container">
          <HeroMain>
            <HeroTitle>
              <span className="text--highlighted">
                The World's Best<sup>*</sup> Chocolate Chip Cookie!
              </span>
            </HeroTitle>            
            <HeroSubtitle>
              <span className="text--highlighted">
                Catch the Holiday Cookie Drop! Order now to pick up on Saturday, December 20th.
              </span>
            </HeroSubtitle>
          </HeroMain>
          <HeroMedia>
            <img src="/images/hero-cookie.png" alt="Chocolate Chip Cookie" />
          </HeroMedia>
        </HeroContainer>
      </Hero>
      </div>

      <ProductsSection className="theme--b">     
        {/* <SectionTitle>Our Cookie Packages</SectionTitle> */}
        {products
          .filter((product) => product.available)
          .map((product) => (
            <ProductDisplay
              key={product.id}
              product={product}
              quantity={getItemQuantityInCart(product.id)}
              onUpdateQuantity={(quantity) =>
                setCartQuantity(product, quantity)
              }
              onViewCart={() => setIsCartOpen(true)}
            />
          ))}
      </ProductsSection>

      <Feature>
        <div className="container">
          <FeatureContent>
            <FeatureMedia>
              <img src="/images/delivery-map.jpg" alt="Delivery Map" />
            </FeatureMedia>
            <FeatureMain>
            <FeatureTitle>Give Me My Cookies!</FeatureTitle>
            <FeatureDescription>
              Order now to pick up on Saturday, December 20th at the Danger Gallery in Stamford, CT. <a
                                href="https://www.google.com/maps/place/Danger+Gallery/@41.0754056,-73.5212585,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2a1add5015f11:0xc93c1e07e6b83389!8m2!3d41.0754056!4d-73.5186782!16s%2Fg%2F11c5fzl55c?entry=ttu&g_ep=EgoyMDI1MTExMS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                className="map-link"
                              >
                                652 Glenbrook Rd #3, Stamford, CT 06906
                              </a>
            </FeatureDescription>
            <FeatureDescription>
              Or if you fit within the delivery radius, we can deliver to your door on Sunday December 21st.
            </FeatureDescription>
            </FeatureMain>
          </FeatureContent>
        </div>
      </Feature>

      <Footer className="theme--a decorative--inset-border">
        <div className="container">
          <FooterContent>
            <FooterText>
              <strong>Chef Jeff Cookies</strong> a division of Schram Industries.
              <br />
              <a href="mailto:schramindustries@gmail.com" className="map-link" style={{ color: "inherit" }}>
                schramindustries@gmail.com
              </a>
            </FooterText>
            <FooterText>
              Licensed Cottage Food Provider in Connecticut.
            </FooterText>
            <AdminButton onClick={() => setCurrentView("admin")}>
              @2025 Schram Industries
            </AdminButton>
          </FooterContent>
        </div>
      </Footer>

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
                    {cart.map((item) => {
                      const product = products.find(p => p.id === item.id);
                      return (
                      <CartItem key={item.id}>
                        <CartItemImage>
                          {product && (
                            <CookieImage
                              product={product}
                              quantity={item.quantity}
                            />
                          )}
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
                    );
                    })}

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
                              Saturday, December 20th from Noon - 4 PM in Stamford, CT
                              <br /> at the Danger Gallery
                              <br />
                              <a
                                href="https://www.google.com/maps/place/Danger+Gallery/@41.0754056,-73.5212585,17z/data=!3m1!4b1!4m6!3m5!1s0x89c2a1add5015f11:0xc93c1e07e6b83389!8m2!3d41.0754056!4d-73.5186782!16s%2Fg%2F11c5fzl55c?entry=ttu&g_ep=EgoyMDI1MTExMS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                className="map-link"
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
                        <FormGroup style={{ paddingBottom: "1rem" }}>
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
