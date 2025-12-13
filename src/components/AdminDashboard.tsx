import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: var(--surface-1);
  padding: 2rem 0;
`;

const AdminHeader = styled.div`
  background-color: var(--text-1);
  color: var(--text-2);
  padding: 2rem 0;
  margin-bottom: 2rem;
  text-align: center;
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const WeekSection = styled.div`
  background-color: var(--surface-1);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
`;

const WeekHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--accent-color);
`;

const WeekTitle = styled.h2`
  color: var(--text-1);
  font-size: 1.8rem;
`;

const WeekStats = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  color: var(--secondary-color);
`;

const DeliverySection = styled.div`
  margin-bottom: 2rem;
`;

const DeliveryTitle = styled.h3`
  color: var(--secondary-color);
  font-size: 1.4rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--surface-1);
  border-radius: var(--border-radius);
`;

const RouteButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: bold;
  margin-left: 1rem;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #3367d6;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHeader = styled.thead`
  background-color: var(--surface-1);
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: bold;
  color: var(--text-1);
  border-bottom: 2px solid var(--accent-color);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #fafafa;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 0.5rem;
  vertical-align: top;
`;

const CustomerName = styled.div`
  font-weight: bold;
  color: var(--text-1);
  margin-bottom: 0.25rem;
`;

const ContactInfo = styled.div`
  font-size: 0.8rem;
  color: var(--text-dark);
  line-height: 1.3;
`;

const OrderItems = styled.div`
  font-size: 0.85rem;
  line-height: 1.4;
`;

const ItemLine = styled.div`
  margin-bottom: 0.2rem;
`;

const TotalAmount = styled.div`
  font-weight: bold;
  color: var(--secondary-color);
  font-size: 1rem;
`;

const CompletionCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--text-1);
`;

const LoginForm = styled.form`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: var(--surface-1);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
`;

const LoginTitle = styled.h2`
  text-align: center;
  color: var(--text-1);
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    border-color: var(--text-1);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background-color: var(--text-1);
  color: var(--text-2);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin-bottom: 1rem;
`;

const EmptyWeek = styled.div`
  text-align: center;
  color: var(--text-dark);
  font-style: italic;
  padding: 2rem;
`;

const RouteInfo = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

interface WeekData {
  weekStart: string;
  weekEnd: string;
  orders: any[];
  totalCookies: number;
  totalRevenue: number;
  totalOrders: number;
}

// Package quantities mapping
const packageQuantities: Record<string, number> = {
  "The Nibbler": 3,
  "Family Pack": 6,
  "The Pro": 12,
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const orders = useQuery(api.orders.getOrders);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const updateFulfillmentStatus = useMutation(
    api.orders.updateFulfillmentStatus
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === "2022#Ch#2022") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid password");
    }
  };

  const handleFulfillmentChange = async (
    orderId: Id<"orders">,
    fulfilled: boolean
  ) => {
    console.log("Handling fulfillment change:", orderId, fulfilled);
    try {
      await updateFulfillmentStatus({
        orderId,
        fulfillmentStatus: fulfilled ? "fulfilled" : "pending",
      });
      console.log("Fulfillment status updated successfully");
    } catch (error) {
      console.error("Error updating fulfillment status:", error);
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday is 0
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatWeekRange = (startDate: Date, endDate: Date) => {
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const startFormatted = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (startMonth === endMonth && startYear === endYear) {
      const endDay = endDate.getDate();
      return `${startFormatted} - ${endDay}, ${startYear}`;
    }

    const endFormatted = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: startYear === endYear ? undefined : "numeric",
    });

    return `${startFormatted} - ${endFormatted}${startYear === endYear ? `, ${startYear}` : ""}`;
  };

  const calculateTotalCookies = (items: any[]): number => {
    return items.reduce((total, item) => {
      const cookiesPerPackage = packageQuantities[item.name] || 0;
      return total + cookiesPerPackage * item.quantity;
    }, 0);
  };

  const generateDeliveryRoute = (deliveryOrders: any[]) => {
    if (deliveryOrders.length === 0) return null;

    // Extract unique addresses
    const addresses = deliveryOrders
      .map((order) => order.deliveryAddress)
      .filter((address, index, self) => self.indexOf(address) === index); // Remove duplicates

    if (addresses.length === 0) return null;

    // Create Google Maps URL with multiple waypoints
    const baseUrl = "https://www.google.com/maps/dir/";

    // Starting point - your specific address
    const startingPoint = "73 Harbor Drive, Stamford, CT 06902";

    // Encode addresses for URL
    const encodedAddresses = addresses.map((addr) => encodeURIComponent(addr));

    // Create the route URL
    let routeUrl = baseUrl + encodeURIComponent(startingPoint);
    encodedAddresses.forEach((addr) => {
      routeUrl += "/" + addr;
    });

    // Add parameters for optimization
    routeUrl += "?optimize=true&travelmode=driving";

    return {
      url: routeUrl,
      addressCount: addresses.length,
      orderCount: deliveryOrders.length,
      addresses: addresses,
    };
  };

  const groupOrdersByWeek = (orders: any[]): WeekData[] => {
    if (!orders) return [];

    const weekMap = new Map<string, WeekData>();

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const weekStart = getWeekStart(orderDate);
      const weekEnd = getWeekEnd(weekStart);
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          orders: [],
          totalCookies: 0,
          totalRevenue: 0,
          totalOrders: 0,
        });
      }

      const weekData = weekMap.get(weekKey)!;
      weekData.orders.push(order);
      weekData.totalCookies += calculateTotalCookies(order.items);
      weekData.totalRevenue += order.totalAmount;
      weekData.totalOrders += 1;
    });

    // Sort by week start date (most recent first)
    return Array.from(weekMap.values()).sort(
      (a, b) =>
        new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
  };

  if (!isAuthenticated) {
    return (
      <AdminContainer>
        <div className="container">
          <LoginForm onSubmit={handleLogin}>
            <LoginTitle>Admin Login</LoginTitle>
            {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LoginButton type="submit">Login</LoginButton>           
          </LoginForm>
        </div>
      </AdminContainer>
    );
  }

  const weeklyData = groupOrdersByWeek(orders || []);

  return (
    <AdminContainer>
      <AdminHeader>
        <div className="container">
          <AdminTitle>Chef Jeff Cookies - Admin Dashboard</AdminTitle>
          <p>Order Management & Weekly Reports</p>
        </div>
      </AdminHeader>

      <div className="container">
        {weeklyData.length === 0 ? (
          <EmptyWeek>No orders found</EmptyWeek>
        ) : (
          weeklyData.map((week, index) => {
            const deliveryOrders = week.orders.filter(
              (o) => o.deliveryType === "delivery"
            );
            const pickupOrders = week.orders.filter(
              (o) => o.deliveryType === "pickup"
            );
            const routeInfo = generateDeliveryRoute(deliveryOrders);

            return (
              <WeekSection key={index}>
                <WeekHeader>
                  <WeekTitle>
                    Week of{" "}
                    {formatWeekRange(
                      new Date(week.weekStart),
                      new Date(week.weekEnd)
                    )}
                  </WeekTitle>
                  <WeekStats>
                    <StatItem>{week.totalOrders} orders</StatItem>
                    <StatItem>{week.totalCookies} cookies</StatItem>
                    <StatItem>${week.totalRevenue.toFixed(2)} revenue</StatItem>
                  </WeekStats>
                </WeekHeader>

                {/* Pickup Orders */}
                <DeliverySection>
                  <DeliveryTitle>
                    🏪 Pickup Orders ({pickupOrders.length})
                  </DeliveryTitle>
                  {pickupOrders.length > 0 ? (
                    <OrderTable>
                      <TableHeader>
                        <tr>
                          <TableHeaderCell style={{ width: "25%" }}>
                            Customer
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "35%" }}>
                            Order Details
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "15%" }}>
                            Total
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "12.5%" }}>
                            Payment
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "12.5%" }}>
                            Pickup
                          </TableHeaderCell>
                        </tr>
                      </TableHeader>
                      <tbody>
                        {pickupOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>
                              <CustomerName>{order.customerName}</CustomerName>
                              <ContactInfo>
                                📧 {order.customerEmail}
                                <br />
                                📱 {order.customerPhone}
                                <br />
                                📅{" "}
                                {new Date(order.orderDate).toLocaleDateString()}
                              </ContactInfo>
                            </TableCell>
                            <TableCell>
                              <OrderItems>
                                {order.items.map((item: any, idx: number) => {
                                  const cookiesPerPackage =
                                    packageQuantities[item.name] || 0;
                                  const totalCookiesForItem =
                                    cookiesPerPackage * item.quantity;
                                  return (
                                    <ItemLine key={idx}>
                                      <strong>
                                        {item.quantity}x {item.name}
                                      </strong>{" "}
                                      ({totalCookiesForItem} cookies) - $
                                      {(item.price * item.quantity).toFixed(2)}
                                    </ItemLine>
                                  );
                                })}
                                <div
                                  style={{
                                    marginTop: "0.5rem",
                                    fontSize: "0.8rem",
                                    color: "#666",
                                  }}
                                >
                                  🍪 Total: {calculateTotalCookies(order.items)}{" "}
                                  cookies
                                </div>
                              </OrderItems>
                            </TableCell>
                            <TableCell>
                              <TotalAmount>
                                ${order.totalAmount.toFixed(2)}
                              </TotalAmount>
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "#22c55e",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                }}
                              >
                                ✅ Paid
                              </div>
                            </TableCell>
                            <TableCell>
                              <CompletionCheckbox>
                                <Checkbox
                                  type="checkbox"
                                  checked={
                                    order.fulfillmentStatus === "fulfilled"
                                  }
                                  onChange={(e) =>
                                    handleFulfillmentChange(
                                      order._id,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label style={{ fontSize: "0.8rem" }}>
                                  Picked up
                                </label>
                              </CompletionCheckbox>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </OrderTable>
                  ) : (
                    <EmptyWeek>No pickup orders this week</EmptyWeek>
                  )}
                </DeliverySection>

                {/* Delivery Orders */}
                <DeliverySection>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <DeliveryTitle style={{ margin: 0 }}>
                      🚚 Delivery Orders ({deliveryOrders.length})
                    </DeliveryTitle>
                    {routeInfo && (
                      <RouteButton
                        onClick={() => window.open(routeInfo.url, "_blank")}
                      >
                        🗺️ Plan Delivery Route
                      </RouteButton>
                    )}
                  </div>

                  {routeInfo && (
                    <RouteInfo>
                      <strong>📍 Delivery Route Planning:</strong>
                      <br />
                      • Starting from: 73 Harbor Drive, Stamford, CT 06902
                      <br />• {routeInfo.orderCount} orders to{" "}
                      {routeInfo.addressCount} unique addresses
                      <br />
                      • Click "Plan Delivery Route" to open optimized route in
                      Google Maps
                      <br />• Addresses:{" "}
                      {routeInfo.addresses.slice(0, 2).join(", ")}
                      {routeInfo.addresses.length > 2
                        ? ` and ${routeInfo.addresses.length - 2} more...`
                        : ""}
                    </RouteInfo>
                  )}

                  {deliveryOrders.length > 0 ? (
                    <OrderTable>
                      <TableHeader>
                        <tr>
                          <TableHeaderCell style={{ width: "25%" }}>
                            Customer
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "35%" }}>
                            Order Details
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "15%" }}>
                            Total
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "12.5%" }}>
                            Payment
                          </TableHeaderCell>
                          <TableHeaderCell style={{ width: "12.5%" }}>
                            Delivery
                          </TableHeaderCell>
                        </tr>
                      </TableHeader>
                      <tbody>
                        {deliveryOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>
                              <CustomerName>{order.customerName}</CustomerName>
                              <ContactInfo>
                                📧 {order.customerEmail}
                                <br />
                                📱 {order.customerPhone}
                                <br />
                                📍 {order.deliveryAddress}
                                <br />
                                📅{" "}
                                {new Date(order.orderDate).toLocaleDateString()}
                              </ContactInfo>
                            </TableCell>
                            <TableCell>
                              <OrderItems>
                                {order.items.map((item: any, idx: number) => {
                                  const cookiesPerPackage =
                                    packageQuantities[item.name] || 0;
                                  const totalCookiesForItem =
                                    cookiesPerPackage * item.quantity;
                                  return (
                                    <ItemLine key={idx}>
                                      <strong>
                                        {item.quantity}x {item.name}
                                      </strong>{" "}
                                      ({totalCookiesForItem} cookies) - $
                                      {(item.price * item.quantity).toFixed(2)}
                                    </ItemLine>
                                  );
                                })}
                                <div
                                  style={{
                                    marginTop: "0.5rem",
                                    fontSize: "0.8rem",
                                    color: "#666",
                                  }}
                                >
                                  🍪 Total: {calculateTotalCookies(order.items)}{" "}
                                  cookies
                                </div>
                              </OrderItems>
                            </TableCell>
                            <TableCell>
                              <TotalAmount>
                                ${order.totalAmount.toFixed(2)}
                              </TotalAmount>
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "#22c55e",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                }}
                              >
                                ✅ Paid
                              </div>
                            </TableCell>
                            <TableCell>
                              <CompletionCheckbox>
                                <Checkbox
                                  type="checkbox"
                                  checked={
                                    order.fulfillmentStatus === "fulfilled"
                                  }
                                  onChange={(e) =>
                                    handleFulfillmentChange(
                                      order._id,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label style={{ fontSize: "0.8rem" }}>
                                  Delivered
                                </label>
                              </CompletionCheckbox>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </OrderTable>
                  ) : (
                    <EmptyWeek>No delivery orders this week</EmptyWeek>
                  )}
                </DeliverySection>
              </WeekSection>
            );
          })
        )}
      </div>
    </AdminContainer>
  );
}
