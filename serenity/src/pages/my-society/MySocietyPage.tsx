import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiHome, 
  FiUser, 
  FiTruck, 
  FiCreditCard, 
  FiAlertCircle, 
  FiEdit, 
  FiEye, 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiUsers, 
  FiDownload,
  FiBarChart,
  FiTrendingUp,
  FiTrendingDown,
  FiBell,
  FiMessageSquare,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiDollarSign
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { 
  MySocietyData,
  UserProfile,
  Unit,
  ParkingSlot,
  Transaction,
  Due
} from '../../types/my-society';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Section = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e6ed;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e6ed;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
`;

const SectionIcon = styled.div<{ $color: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3498db;
    color: white;
  }

  &.primary {
    background: #3498db;
    color: white;

    &:hover {
      background: #2980b9;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #f8f9fa;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #7f8c8d;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
`;

const Status = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'active':
      case 'completed':
      case 'paid':
        return '#d5f4e6';
      case 'pending':
      case 'in-progress':
        return '#fff3cd';
      case 'overdue':
      case 'failed':
        return '#f8d7da';
      default:
        return '#e0e6ed';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
      case 'completed':
      case 'paid':
        return '#155724';
      case 'pending':
      case 'in-progress':
        return '#856404';
      case 'overdue':
      case 'failed':
        return '#721c24';
      default:
        return '#495057';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;

  h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  p {
    margin: 0;
  }
`;

// Dashboard Widgets Styles
const WidgetsSection = styled.div`
  margin-bottom: 2rem;
`;

const WidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Widget = styled.div<{ $color: string }>`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${props => props.$color};
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const WidgetIcon = styled.div<{ $color: string }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 1.125rem;
`;

const WidgetValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const WidgetLabel = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
`;

const WidgetTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.$positive ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
`;

const ActivityWidget = styled(Widget)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 150px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.8rem;
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.125rem;
  font-size: 0.8rem;
`;

const ActivityTime = styled.div`
  color: #7f8c8d;
  font-size: 0.7rem;
`;

// Mock data - in real app, this would come from API
const mockData: MySocietyData = {
  userProfile: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    apartmentNumber: 'A-101',
    floor: 1,
    wing: 'A',
    role: 'owner',
    status: 'active',
    dateJoined: new Date('2023-01-15'),
    lastActive: new Date(),
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+91 9876543211'
    },
    familyMembers: [
      {
        id: '1',
        name: 'Jane Doe',
        relationship: 'Spouse',
        age: 32,
        emergencyContact: true
      },
      {
        id: '2',
        name: 'Tommy Doe',
        relationship: 'Son',
        age: 8,
        emergencyContact: false
      }
    ],
    vehicles: [
      {
        id: '1',
        type: 'car',
        make: 'Honda',
        model: 'City',
        year: 2021,
        color: 'White',
        registrationNumber: 'MH01AB1234',
        isActive: true
      }
    ]
  },
  units: [
    {
      id: '1',
      unitNumber: 'A-101',
      type: 'apartment',
      size: 1200,
      bedrooms: 2,
      bathrooms: 2,
      floorNumber: 1,
      wing: 'A',
      status: 'occupied',
      amenities: ['Parking', 'Balcony', 'Power Backup'],
      maintenanceSchedule: [],
      contactPerson: {
        name: 'Society Manager',
        role: 'Manager',
        phone: '+91 9876543200',
        email: 'manager@society.com'
      },
      location: {
        building: 'Tower A',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      bookingHistory: [],
      feedback: [],
      images: []
    },
    {
      id: '2',
      unitNumber: 'B-205',
      type: 'apartment',
      size: 1450,
      bedrooms: 3,
      bathrooms: 2,
      floorNumber: 2,
      wing: 'B',
      status: 'occupied',
      amenities: ['Parking', 'Balcony', 'Garden View', 'Power Backup'],
      maintenanceSchedule: [],
      contactPerson: {
        name: 'Society Manager',
        role: 'Manager',
        phone: '+91 9876543200',
        email: 'manager@society.com'
      },
      location: {
        building: 'Tower B',
        coordinates: { lat: 19.0765, lng: 72.8782 }
      },
      bookingHistory: [],
      feedback: [],
      images: []
    },
    {
      id: '3',
      unitNumber: 'C-301',
      type: 'penthouse',
      size: 1800,
      bedrooms: 4,
      bathrooms: 3,
      floorNumber: 3,
      wing: 'C',
      status: 'occupied',
      amenities: ['Premium Parking', 'Terrace', 'Garden View', 'Power Backup', 'Private Lift'],
      maintenanceSchedule: [],
      contactPerson: {
        name: 'Society Manager',
        role: 'Manager',
        phone: '+91 9876543200',
        email: 'manager@society.com'
      },
      location: {
        building: 'Tower C',
        coordinates: { lat: 19.0770, lng: 72.8787 }
      },
      bookingHistory: [],
      feedback: [],
      images: []
    }
  ],
  parkingSlots: [
    {
      id: '1',
      slotNumber: 'A-12',
      type: 'covered',
      assignedTo: '1',
      status: 'occupied',
      vehicleDetails: {
        registrationNumber: 'MH01AB1234',
        type: 'car',
        make: 'Honda',
        model: 'City'
      },
      parkingDuration: {
        startDate: new Date('2023-01-15'),
        isMonthly: true
      },
      location: {
        floor: 0,
        section: 'A',
        nearestEntrance: 'Main Gate'
      },
      bookingHistory: [],
      images: [],
      monthlyFee: 2000
    },
    {
      id: '2',
      slotNumber: 'B-18',
      type: 'open',
      assignedTo: '2',
      status: 'occupied',
      vehicleDetails: {
        registrationNumber: 'MH12CD5678',
        type: 'car',
        make: 'Toyota',
        model: 'Innova'
      },
      parkingDuration: {
        startDate: new Date('2023-03-10'),
        isMonthly: true
      },
      location: {
        floor: 0,
        section: 'B',
        nearestEntrance: 'Side Gate'
      },
      bookingHistory: [],
      images: [],
      monthlyFee: 1500
    },
    {
      id: '3',
      slotNumber: 'C-25',
      type: 'covered',
      assignedTo: '3',
      status: 'occupied',
      vehicleDetails: {
        registrationNumber: 'MH14EF9012',
        type: 'car',
        make: 'BMW',
        model: 'X3'
      },
      parkingDuration: {
        startDate: new Date('2023-02-01'),
        isMonthly: true
      },
      location: {
        floor: 1,
        section: 'C',
        nearestEntrance: 'Premium Entry'
      },
      bookingHistory: [],
      images: [],
      monthlyFee: 3000
    },
    {
      id: '4',
      slotNumber: 'A-08',
      type: 'open',
      assignedTo: '1',
      status: 'available',
      vehicleDetails: {
        registrationNumber: 'MH02GH3456',
        type: 'bike',
        make: 'Hero',
        model: 'Splendor'
      },
      parkingDuration: {
        startDate: new Date('2023-06-15'),
        isMonthly: false
      },
      location: {
        floor: 0,
        section: 'A',
        nearestEntrance: 'Main Gate'
      },
      bookingHistory: [],
      images: [],
      monthlyFee: 500
    }
  ],
  transactions: [
    {
      id: '1',
      date: new Date('2024-01-15'),
      amount: 5000,
      type: 'maintenance',
      status: 'completed',
      paymentMethod: 'upi',
      description: 'Monthly Maintenance Fee - January 2024',
      category: 'Recurring Payment'
    },
    {
      id: '2',
      date: new Date('2023-12-15'),
      amount: 3000,
      type: 'utility',
      status: 'completed',
      paymentMethod: 'card',
      description: 'Electricity Bill - December 2023',
      category: 'Utility Payment'
    },
    {
      id: '3',
      date: new Date('2023-11-20'),
      amount: 1500,
      type: 'amenity',
      status: 'completed',
      paymentMethod: 'upi',
      description: 'Swimming Pool Booking',
      category: 'Amenity Booking'
    }
  ],
  dues: [
    {
      id: '1',
      amount: 5000,
      dueDate: new Date('2024-02-15'),
      status: 'pending',
      type: 'maintenance',
      description: 'Monthly Maintenance Fee - February 2024',
      relatedUnit: 'A-101'
    }
  ],
  sectionVisibility: {
    profile: true,
    units: true,
    parking: true,
    transactions: true,
    dues: true
  },
  lastUpdated: new Date()
};

// Additional mock data for widgets
const mockWidgetData = {
  recentAnnouncements: [
    {
      id: '1',
      title: 'Water Supply Maintenance',
      content: 'Water supply will be interrupted tomorrow from 10 AM to 2 PM',
      date: new Date('2024-01-20'),
      priority: 'high'
    },
    {
      id: '2',
      title: 'Society Meeting',
      content: 'Monthly society meeting scheduled for next Sunday',
      date: new Date('2024-01-18'),
      priority: 'medium'
    }
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Holi Celebration',
      date: new Date('2024-03-13'),
      location: 'Society Garden'
    },
    {
      id: '2',
      title: 'Security Training',
      date: new Date('2024-02-25'),
      location: 'Community Hall'
    }
  ],
  recentComplaints: [
    {
      id: '1',
      title: 'Lift not working in Tower A',
      status: 'in-progress',
      date: new Date('2024-01-19')
    },
    {
      id: '2',
      title: 'Parking slot water logging',
      status: 'resolved',
      date: new Date('2024-01-15')
    }
  ],
  recentSuggestions: [
    {
      id: '1',
      title: 'Install more CCTV cameras',
      status: 'under-review',
      date: new Date('2024-01-17')
    }
  ],
  newsletters: [
    {
      id: '1',
      title: 'January 2024 Newsletter',
      date: new Date('2024-01-01'),
      url: '/newsletters/jan-2024.pdf'
    }
  ]
};

const MySocietyPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<MySocietyData>(mockData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In real app, fetch data from API
    setIsLoading(false);
  }, []);

  const handleEditProfile = useCallback(() => {
    console.log('Edit profile clicked');
  }, []);

  const handleViewUnitDetails = useCallback((unitId: string) => {
    console.log('View unit details:', unitId);
  }, []);

  const handlePayDue = useCallback((dueId: string) => {
    console.log('Pay due:', dueId);
  }, []);

  const handleDownloadReceipt = useCallback((transactionId: string) => {
    console.log('Download receipt:', transactionId);
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <FiHome />
        My Society
      </Title>

      {/* Dashboard Widgets Section */}
      <WidgetsSection>
        <WidgetsGrid>
          {/* Total Units Widget */}
          <Widget $color="#3498db">
            <WidgetHeader>
              <WidgetIcon $color="#3498db">
                <FiHome />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetValue>{data.units.length}</WidgetValue>
            <WidgetLabel>Total Units</WidgetLabel>
          </Widget>

          {/* Total Parking Slots Widget */}
          <Widget $color="#f39c12">
            <WidgetHeader>
              <WidgetIcon $color="#f39c12">
                <FiTruck />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetValue>{data.parkingSlots.length}</WidgetValue>
            <WidgetLabel>Parking Slots</WidgetLabel>
          </Widget>

          {/* Total Transactions Widget */}
          <Widget $color="#9b59b6">
            <WidgetHeader>
              <WidgetIcon $color="#9b59b6">
                <FiCreditCard />
              </WidgetIcon>
              <WidgetTrend $positive={true}>
                <FiTrendingUp />
                +2 this month
              </WidgetTrend>
            </WidgetHeader>
            <WidgetValue>{data.transactions.length}</WidgetValue>
            <WidgetLabel>Total Transactions</WidgetLabel>
          </Widget>

          {/* Total Dues Widget */}
          <Widget $color="#e74c3c">
            <WidgetHeader>
              <WidgetIcon $color="#e74c3c">
                <FiAlertCircle />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetValue>{data.dues.length}</WidgetValue>
            <WidgetLabel>Pending Dues</WidgetLabel>
          </Widget>

          {/* Last Transaction Widget */}
          <Widget $color="#27ae60">
            <WidgetHeader>
              <WidgetIcon $color="#27ae60">
                <FiDollarSign />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetValue>₹{data.transactions[0]?.amount || 0}</WidgetValue>
            <WidgetLabel>Last Transaction</WidgetLabel>
          </Widget>

          {/* Analytics Widget */}
          <Widget $color="#16a085">
            <WidgetHeader>
              <WidgetIcon $color="#16a085">
                <FiBarChart />
              </WidgetIcon>
              <WidgetTrend $positive={false}>
                <FiTrendingDown />
                -5% from last month
              </WidgetTrend>
            </WidgetHeader>
            <WidgetValue>₹{data.transactions.reduce((sum, t) => sum + t.amount, 0)}</WidgetValue>
            <WidgetLabel>Total Spending</WidgetLabel>
          </Widget>
        </WidgetsGrid>

        {/* Activity Widgets */}
        <WidgetsGrid>
          {/* Recent Announcements */}
          <ActivityWidget $color="#3498db">
            <WidgetHeader>
              <WidgetIcon $color="#3498db">
                <FiBell />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetLabel style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Recent Announcements</WidgetLabel>
            <ActivityList>
              {mockWidgetData.recentAnnouncements.map(announcement => (
                <ActivityItem key={announcement.id}>
                  <ActivityIcon $color={announcement.priority === 'high' ? '#e74c3c' : announcement.priority === 'medium' ? '#f39c12' : '#27ae60'}>
                    <FiBell />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{announcement.title}</ActivityTitle>
                    <ActivityTime>{announcement.date.toLocaleDateString()}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          </ActivityWidget>

          {/* Upcoming Events */}
          <ActivityWidget $color="#f39c12">
            <WidgetHeader>
              <WidgetIcon $color="#f39c12">
                <FiCalendar />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetLabel style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Upcoming Events</WidgetLabel>
            <ActivityList>
              {mockWidgetData.upcomingEvents.map(event => (
                <ActivityItem key={event.id}>
                  <ActivityIcon $color="#f39c12">
                    <FiCalendar />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{event.title}</ActivityTitle>
                    <ActivityTime>{event.date.toLocaleDateString()} • {event.location}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          </ActivityWidget>
        </WidgetsGrid>

        <WidgetsGrid>
          {/* Recent Complaints & Suggestions */}
          <ActivityWidget $color="#e74c3c">
            <WidgetHeader>
              <WidgetIcon $color="#e74c3c">
                <FiMessageSquare />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetLabel style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Recent Complaints & Suggestions</WidgetLabel>
            <ActivityList>
              {mockWidgetData.recentComplaints.map(complaint => (
                <ActivityItem key={complaint.id}>
                  <ActivityIcon $color={complaint.status === 'resolved' ? '#27ae60' : '#f39c12'}>
                    <FiMessageSquare />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{complaint.title}</ActivityTitle>
                    <ActivityTime>{complaint.date.toLocaleDateString()} • {complaint.status}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
              {mockWidgetData.recentSuggestions.map(suggestion => (
                <ActivityItem key={suggestion.id}>
                  <ActivityIcon $color="#9b59b6">
                    <FiActivity />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{suggestion.title}</ActivityTitle>
                    <ActivityTime>{suggestion.date.toLocaleDateString()} • {suggestion.status}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          </ActivityWidget>

          {/* Society Newsletter */}
          <Widget $color="#16a085">
            <WidgetHeader>
              <WidgetIcon $color="#16a085">
                <FiFileText />
              </WidgetIcon>
            </WidgetHeader>
            <WidgetLabel style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Latest Newsletter</WidgetLabel>
            {mockWidgetData.newsletters.map(newsletter => (
              <ActivityItem key={newsletter.id}>
                <ActivityIcon $color="#16a085">
                  <FiFileText />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{newsletter.title}</ActivityTitle>
                  <ActivityTime>{newsletter.date.toLocaleDateString()}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </Widget>
        </WidgetsGrid>
      </WidgetsSection>

      <SectionsContainer>
        {/* Profile Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color="#3498db">
                <FiUser />
              </SectionIcon>
              Profile Information
            </SectionTitle>
            <ActionButton onClick={handleEditProfile}>
              <FiEdit />
              Edit Profile
            </ActionButton>
          </SectionHeader>

          <Grid>
            <Card>
              <CardTitle>{data.userProfile.name}</CardTitle>
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{data.userProfile.email}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{data.userProfile.phone}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Unit</InfoLabel>
                <InfoValue>{data.userProfile.apartmentNumber}, Floor {data.userProfile.floor}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Role</InfoLabel>
                <InfoValue>{data.userProfile.role.charAt(0).toUpperCase() + data.userProfile.role.slice(1)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Status</InfoLabel>
                <Status $status={data.userProfile.status}>{data.userProfile.status}</Status>
              </InfoRow>
            </Card>

            <Card>
              <CardTitle>Family Members ({data.userProfile.familyMembers.length})</CardTitle>
              {data.userProfile.familyMembers.length > 0 ? (
                data.userProfile.familyMembers.map(member => (
                  <InfoRow key={member.id}>
                    <InfoLabel>{member.relationship}</InfoLabel>
                    <InfoValue>{member.name} ({member.age} years)</InfoValue>
                  </InfoRow>
                ))
              ) : (
                <EmptyState>
                  <p>No family members added</p>
                </EmptyState>
              )}
            </Card>

            <Card>
              <CardTitle>Vehicles ({data.userProfile.vehicles.length})</CardTitle>
              {data.userProfile.vehicles.length > 0 ? (
                data.userProfile.vehicles.map(vehicle => (
                  <InfoRow key={vehicle.id}>
                    <InfoLabel>{vehicle.make} {vehicle.model}</InfoLabel>
                    <InfoValue>{vehicle.registrationNumber}</InfoValue>
                  </InfoRow>
                ))
              ) : (
                <EmptyState>
                  <p>No vehicles registered</p>
                </EmptyState>
              )}
            </Card>
          </Grid>
        </Section>

        {/* Units Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color="#27ae60">
                <FiHome />
              </SectionIcon>
              My Units
            </SectionTitle>
            <ActionButton onClick={() => handleViewUnitDetails(data.units[0]?.id)}>
              <FiEye />
              View Details
            </ActionButton>
          </SectionHeader>

          <Grid>
            {data.units.map(unit => (
              <Card key={unit.id}>
                <CardTitle>{unit.unitNumber} - {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}</CardTitle>
                <InfoRow>
                  <InfoLabel>Size</InfoLabel>
                  <InfoValue>{unit.size} sqft</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Bedrooms / Bathrooms</InfoLabel>
                  <InfoValue>{unit.bedrooms} / {unit.bathrooms}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Status</InfoLabel>
                  <Status $status={unit.status}>{unit.status}</Status>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Building</InfoLabel>
                  <InfoValue>{unit.location.building}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Amenities</InfoLabel>
                  <InfoValue style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>
                    {unit.amenities.slice(0, 2).join(', ')}{unit.amenities.length > 2 && ` +${unit.amenities.length - 2} more`}
                  </InfoValue>
                </InfoRow>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* Parking Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color="#f39c12">
                <FiTruck />
              </SectionIcon>
              Parking
            </SectionTitle>
          </SectionHeader>

          <Grid>
            {data.parkingSlots.map(slot => (
              <Card key={slot.id}>
                <CardTitle>Slot {slot.slotNumber} • <Status $status={slot.status}>{slot.status}</Status></CardTitle>
                <InfoRow>
                  <InfoLabel>Vehicle • Fee</InfoLabel>
                  <InfoValue>{slot.vehicleDetails.registrationNumber} • ₹{slot.monthlyFee}/mo</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Type • Location</InfoLabel>
                  <InfoValue>{slot.type.charAt(0).toUpperCase() + slot.type.slice(1)} • Floor {slot.location.floor}, Sec {slot.location.section}</InfoValue>
                </InfoRow>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* Transactions Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color="#9b59b6">
                <FiCreditCard />
              </SectionIcon>
              Transactions
            </SectionTitle>
            <ActionButton>
              <FiDownload />
              Download Statement
            </ActionButton>
          </SectionHeader>

          <Grid>
            {data.transactions.map(transaction => (
              <Card key={transaction.id}>
                <CardTitle>{transaction.description}</CardTitle>
                <InfoRow>
                  <InfoLabel>Amount</InfoLabel>
                  <InfoValue>₹{transaction.amount}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Date</InfoLabel>
                  <InfoValue>{transaction.date.toLocaleDateString()}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Method</InfoLabel>
                  <InfoValue>{transaction.paymentMethod.toUpperCase()}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Status</InfoLabel>
                  <Status $status={transaction.status}>{transaction.status}</Status>
                </InfoRow>
                <ActionButton 
                  style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                  onClick={() => handleDownloadReceipt(transaction.id)}
                >
                  <FiDownload />
                  Download Receipt
                </ActionButton>
              </Card>
            ))}
          </Grid>
        </Section>

        {/* Dues Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <SectionIcon $color="#e74c3c">
                <FiAlertCircle />
              </SectionIcon>
              Outstanding Dues
            </SectionTitle>
          </SectionHeader>

          <Grid>
            {data.dues.map(due => (
              <Card key={due.id}>
                <CardTitle>{due.description} • <Status $status={due.status}>{due.status}</Status></CardTitle>
                <InfoRow>
                  <InfoLabel>Amount • Due Date</InfoLabel>
                  <InfoValue>₹{due.amount} • {due.dueDate.toLocaleDateString()}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Type</InfoLabel>
                  <InfoValue>{due.type.charAt(0).toUpperCase() + due.type.slice(1)}</InfoValue>
                </InfoRow>
                <ActionButton 
                  className="primary"
                  style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '0.5rem 1rem' }}
                  onClick={() => handlePayDue(due.id)}
                >
                  <FiCreditCard />
                  Pay Now
                </ActionButton>
              </Card>
            ))}

            {data.dues.length === 0 && (
              <EmptyState>
                <h3>No Outstanding Dues</h3>
                <p>All your payments are up to date!</p>
              </EmptyState>
            )}
          </Grid>
        </Section>
      </SectionsContainer>
    </Container>
  );
};

export default MySocietyPage;
