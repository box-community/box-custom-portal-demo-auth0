import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import tw from "twin.macro";
import styled from "styled-components";
import { 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign,
  TrendingUp,
  CreditCard,
  Briefcase,
  Shield,
  Users
} from 'lucide-react';

// Monthly performance data
const monthlyPerformance = [
  { month: 'Jan', investments: 45000, savings: 15000 },
  { month: 'Feb', investments: 47500, savings: 15500 },
  { month: 'Mar', investments: 46800, savings: 16000 },
  { month: 'Apr', investments: 48900, savings: 16200 },
  { month: 'May', investments: 51200, savings: 16800 },
  { month: 'Jun', investments: 53500, savings: 17200 }
];

// Portfolio allocation data
const portfolioAllocation = [
  { name: 'US Stocks', value: 45 },
  { name: "Int'l Stocks", value: 25 },
  { name: 'Bonds', value: 20 },
  { name: 'Cash', value: 10 }
];

// Recent transactions
const recentTransactions = [
  { date: '2024-03-15', type: 'Deposit', amount: 500, description: 'Monthly Interest' },
  { date: '2024-03-14', type: 'Withdrawal', amount: -200, description: 'Broker Fee' },
  { date: '2024-03-13', type: 'Investment', amount: -2000, description: 'Stock Purchase' },
  { date: '2024-03-12', type: 'Dividend', amount: 150, description: 'AAPL Dividend' }
];

const COLORS = ['#0284c7', '#0369a1', '#075985', '#0c4a6e'];

const HeroTitle = tw.h1`text-4xl font-bold text-white mb-6`;

const HeroDescription = tw.p`text-xl text-blue-100 mb-8 max-w-3xl mx-auto`;

const CTAButton = tw.button`bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-500 transition-colors`;

const FeatureCard = tw.div`bg-white rounded-lg shadow-lg p-6 text-center`;

const IconContainer = tw.div`w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4`;

const WelcomeText = tw.h1`text-3xl font-bold mb-2`;

const AccountInfo = tw.p`text-blue-100 text-lg`;

const MetricHeader = tw.div`flex items-center justify-between mb-4`;

const MetricTitle = tw.h3`text-lg font-medium text-gray-900`;

const MetricIcon = styled.div`
  ${tw`p-3 rounded-full bg-blue-100`}
`;

const MetricValue = tw.p`text-3xl font-bold text-gray-900`;

const MetricChange = styled.span`
  ${tw`text-sm font-medium ml-2`}
  color: ${props => props.positive ? '#059669' : '#DC2626'};
`;

const ChartTitle = tw.h3`text-lg font-medium text-gray-900 mb-4`;

const TransactionList = tw.div`divide-y divide-gray-200`;

const TransactionItem = tw.div`flex items-center justify-between py-3`;

const TransactionInfo = tw.div`flex flex-col`;

const TransactionDate = tw.span`text-sm text-gray-500`;

const TransactionDescription = tw.span`font-medium text-gray-900`;

const Container = tw.div`min-h-screen bg-gray-100`;

const HeroSection = tw.div`relative bg-blue-600 pb-32 overflow-hidden`;

const WavePattern = styled.div`
  ${tw`absolute inset-0 opacity-25`}
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
`;

// Updated Hero Content to be wider
const HeroContent = tw.div`max-w-4xl mx-auto px-4 pt-16 pb-8 relative z-10 text-center`;

// Updated Features Section to be wider
const FeaturesSection = tw.div`max-w-4xl mx-auto px-4 -mt-24 grid gap-6 grid-cols-1 md:grid-cols-3 relative z-20`;

// Updated Dashboard Container to be wider and use more screen space
const DashboardContainer = tw.div`max-w-screen-2xl mx-auto px-8`;

const WelcomeSection = tw.div`bg-blue-600 text-white rounded-lg p-6 mb-8 shadow-lg`;

// Updated Grid Container to better utilize space
const GridContainer = tw.div`grid gap-6 grid-cols-1 lg:grid-cols-3 mb-6`;

const Card = styled.div`
  ${tw`bg-white rounded-lg shadow-lg p-6`}
`;

const MetricCard = styled(Card)`
  ${tw`flex flex-col`}
`;

// Updated Chart Card to better handle the wider layout
const ChartCard = styled(Card)`
  ${tw`col-span-1 lg:col-span-3 xl:col-span-2`}
`;

// Add a new container for the side-by-side charts
const ChartsContainer = tw.div`grid gap-6 grid-cols-1 xl:grid-cols-2`;

const TransactionAmount = styled.span`
  ${tw`font-medium`}
  color: ${props => props.type === 'Deposit' || props.type === 'Dividend' 
    ? '#059669' 
    : '#DC2626'};
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Landing page content
const LandingContent = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <>
      <HeroSection>
        <WavePattern />
        <HeroContent>
          <HeroTitle>
            Your Financial Future Starts Here
          </HeroTitle>
          <HeroDescription>
            Join thousands of clients who trust Increo Financial with their investments,
            wealth management, and financial planning needs.
          </HeroDescription>
          <CTAButton onClick={() => loginWithRedirect()}>
            Get Started Today
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeatureCard>
          <IconContainer>
            <Briefcase size={32} className="text-white" />
          </IconContainer>
          <h3 className="text-xl font-semibold mb-2">Investment Management</h3>
          <p className="text-gray-600">Expert portfolio management tailored to your goals</p>
        </FeatureCard>

        <FeatureCard>
          <IconContainer>
            <Shield size={32} className="text-white" />
          </IconContainer>
          <h3 className="text-xl font-semibold mb-2">Wealth Protection</h3>
          <p className="text-gray-600">Comprehensive risk management strategies</p>
        </FeatureCard>

        <FeatureCard>
          <IconContainer>
            <Users size={32} className="text-white" />
          </IconContainer>
          <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
          <p className="text-gray-600">Personal advisors dedicated to your success</p>
        </FeatureCard>
      </FeaturesSection>
    </>
  );
};

// Dashboard content
const DashboardContent = () => {
  const { user } = useAuth0();
  
  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeText>
          Welcome back, {user?.name}
        </WelcomeText>
        <AccountInfo>
          Account #: 1234-5678-9012 | Last Login: {new Date().toLocaleDateString()}
        </AccountInfo>
      </WelcomeSection>
      
      <GridContainer>
        <MetricCard>
          <MetricHeader>
            <MetricTitle>Total Portfolio</MetricTitle>
            <MetricIcon>
              <DollarSign size={24} className="text-blue-600" />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{formatCurrency(85700)}</MetricValue>
          <MetricChange positive>+8.3% this month</MetricChange>
        </MetricCard>
        
        <MetricCard>
          <MetricHeader>
            <MetricTitle>Investments</MetricTitle>
            <MetricIcon>
              <TrendingUp size={24} className="text-blue-600" />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{formatCurrency(53500)}</MetricValue>
          <MetricChange positive>+4.5% this month</MetricChange>
        </MetricCard>
        
        <MetricCard>
          <MetricHeader>
            <MetricTitle>Cash Balance</MetricTitle>
            <MetricIcon>
              <CreditCard size={24} className="text-blue-600" />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{formatCurrency(32200)}</MetricValue>
          <MetricChange positive>+2.8% this month</MetricChange>
        </MetricCard>

        <ChartsContainer className="lg:col-span-3">
          <ChartCard>
            <ChartTitle>Portfolio Performance</ChartTitle>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <AreaChart 
                  data={monthlyPerformance}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <defs>
                    <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="investments" 
                    stroke="#0284c7" 
                    fillOpacity={1} 
                    fill="url(#colorInvestments)" 
                    name="Investments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Asset Allocation</ChartTitle>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={portfolioAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {portfolioAllocation.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </ChartsContainer>

        <ChartCard className="lg:col-span-3">
          <ChartTitle>Recent Transactions</ChartTitle>
          <TransactionList>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem key={index}>
                <TransactionInfo>
                  <TransactionDescription>{transaction.description}</TransactionDescription>
                  <TransactionDate>{formatDate(transaction.date)}</TransactionDate>
                </TransactionInfo>
                <TransactionAmount type={transaction.type}>
                  {formatCurrency(transaction.amount)}
                </TransactionAmount>
              </TransactionItem>
            ))}
          </TransactionList>
        </ChartCard>
      </GridContainer>
    </DashboardContainer>
  );
};

const FinancialDashboard = () => {
  const { isAuthenticated } = useAuth0();
  
  return (
    <Container>
      {isAuthenticated ? <DashboardContent /> : <LandingContent />}
    </Container>
  );
};

export default FinancialDashboard;