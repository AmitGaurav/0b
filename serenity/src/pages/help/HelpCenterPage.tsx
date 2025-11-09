import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaPhone, FaSms, FaEnvelope, FaWhatsapp, FaSearch, FaFilter, FaExclamationTriangle, FaShieldAlt, FaTools, FaMedkit, FaUsers, FaCog, FaBolt, FaBuilding } from 'react-icons/fa';
import { useAuthContext } from '../../contexts/AuthContext';
import EmergencyProtocols from '../../components/help/EmergencyProtocols';
import QuickEmergencyDial from '../../components/help/QuickEmergencyDial';
import { 
  EmergencyContact, 
  ContactDepartment, 
  ContactCategory, 
  ContactPriority, 
  Availability, 
  ContactFilter,
  QuickAction 
} from '../../types/helpCenter';

const HelpCenterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
`;

const EmergencyBanner = styled.div`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
    100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
  }
`;

const SearchAndFilterContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #bdc3c7;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$active ? '#3498db' : '#e0e6ed'};
  background: ${props => props.$active ? '#3498db' : 'white'};
  color: ${props => props.$active ? 'white' : '#2c3e50'};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    border-color: #3498db;
    background: ${props => props.$active ? '#2980b9' : '#ecf0f1'};
  }
`;

const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const ContactCard = styled.div<{ $priority: ContactPriority }>`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.$priority) {
      case ContactPriority.CRITICAL: return '#e74c3c';
      case ContactPriority.HIGH: return '#f39c12';
      case ContactPriority.MEDIUM: return '#3498db';
      default: return '#95a5a6';
    }
  }};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ContactHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.125rem;
`;

const ContactDesignation = styled.p`
  margin: 0 0 0.5rem 0;
  color: #7f8c8d;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmergencyBadge = styled.span`
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const AvailabilityBadge = styled.span<{ $availability: Availability }>`
  background: ${props => {
    switch (props.$availability) {
      case Availability.FULL_TIME: return '#27ae60';
      case Availability.BUSINESS_HOURS: return '#3498db';
      case Availability.ON_CALL: return '#f39c12';
      case Availability.EMERGENCY_ONLY: return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: inline-block;
`;

const ContactActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.a`
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CallButton = styled(ActionButton)`
  background: linear-gradient(135deg, #27ae60, #2ecc71);
`;

const SMSButton = styled(ActionButton)`
  background: linear-gradient(135deg, #3498db, #5dade2);
`;

const WhatsAppButton = styled(ActionButton)`
  background: linear-gradient(135deg, #25d366, #128c7e);
`;

const EmailButton = styled(ActionButton)`
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
`;

const DepartmentIcon = styled.div<{ $department: ContactDepartment }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
  background: ${props => {
    switch (props.$department) {
      case ContactDepartment.SECURITY: return '#34495e';
      case ContactDepartment.MAINTENANCE: return '#f39c12';
      case ContactDepartment.MEDICAL: return '#e74c3c';
      case ContactDepartment.ADMINISTRATION: return '#3498db';
      case ContactDepartment.COMMITTEE: return '#9b59b6';
      case ContactDepartment.UTILITIES: return '#1abc9c';
      default: return '#95a5a6';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HelpCenterPage: React.FC = () => {
  const { user, getCurrentSociety } = useAuthContext();
  const currentSociety = getCurrentSociety();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ContactDepartment | 'ALL'>('ALL');

  // Mock data - in real application, this would come from API
  const emergencyContacts: EmergencyContact[] = [
    // Security Personnel
    {
      id: '1',
      name: 'Rajesh Kumar',
      designation: 'Chief Security Officer',
      department: ContactDepartment.SECURITY,
      category: ContactCategory.CHIEF_SECURITY,
      phone: '+91 98765 43210',
      alternatePhone: '+91 87654 32109',
      email: 'security@society.com',
      availability: Availability.FULL_TIME,
      isEmergency: true,
      priority: ContactPriority.CRITICAL,
      location: 'Main Gate',
      languages: ['Hindi', 'English', 'Marathi']
    },
    {
      id: '1a',
      name: 'Sunil Patil',
      designation: 'Night Security Guard',
      department: ContactDepartment.SECURITY,
      category: ContactCategory.NIGHT_SECURITY,
      phone: '+91 87654 32108',
      availability: Availability.NIGHT_SHIFT,
      isEmergency: true,
      priority: ContactPriority.HIGH,
      location: 'Main Gate',
      languages: ['Hindi', 'Marathi']
    },
    {
      id: '1b',
      name: 'Ramesh Singh',
      designation: 'CCTV Monitoring',
      department: ContactDepartment.SECURITY,
      category: ContactCategory.CCTV_MONITORING,
      phone: '+91 76543 21098',
      availability: Availability.FULL_TIME,
      isEmergency: false,
      priority: ContactPriority.HIGH,
      location: 'Security Control Room',
      languages: ['Hindi', 'English']
    },

    // Medical & Emergency Services
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      designation: 'Society Doctor',
      department: ContactDepartment.MEDICAL,
      category: ContactCategory.DOCTOR,
      phone: '+91 99999 88888',
      email: 'doctor@society.com',
      availability: Availability.ON_CALL,
      isEmergency: true,
      priority: ContactPriority.CRITICAL,
      location: 'Medical Room, Block A',
      languages: ['English', 'Hindi', 'Tamil']
    },
    {
      id: '2a',
      name: 'Sister Mary',
      designation: 'Society Nurse',
      department: ContactDepartment.MEDICAL,
      category: ContactCategory.NURSE,
      phone: '+91 88888 99999',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: true,
      priority: ContactPriority.HIGH,
      location: 'Medical Room, Block A',
      languages: ['English', 'Hindi', 'Malayalam']
    },
    {
      id: '5',
      name: 'Fire Brigade',
      designation: 'Emergency Service',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.FIRE_BRIGADE,
      phone: '101',
      availability: Availability.FULL_TIME,
      isEmergency: true,
      priority: ContactPriority.CRITICAL,
      description: 'Fire emergency services'
    },
    {
      id: '6',
      name: 'Police Control Room',
      designation: 'Emergency Service',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.POLICE,
      phone: '100',
      availability: Availability.FULL_TIME,
      isEmergency: true,
      priority: ContactPriority.CRITICAL,
      description: 'Police emergency services'
    },
    {
      id: '7',
      name: 'Ambulance Service',
      designation: 'Emergency Medical',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.AMBULANCE,
      phone: '102',
      availability: Availability.FULL_TIME,
      isEmergency: true,
      priority: ContactPriority.CRITICAL,
      description: 'Emergency medical services'
    },
    {
      id: '7a',
      name: 'Fortis Hospital',
      designation: 'Multi-Specialty Hospital',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.HOSPITAL,
      phone: '+91 80 6621 4444',
      availability: Availability.FULL_TIME,
      isEmergency: true,
      priority: ContactPriority.CRITICAL,
      description: '24x7 Emergency Services',
      location: '2.5 km from society'
    },

    // Maintenance Team
    {
      id: '3',
      name: 'Amit Patel',
      designation: 'Maintenance Head',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.CHIEF_MAINTENANCE,
      phone: '+91 88888 77777',
      email: 'maintenance@society.com',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.HIGH,
      location: 'Maintenance Office',
      languages: ['Hindi', 'English', 'Gujarati']
    },
    {
      id: '8',
      name: 'Raman Electrician',
      designation: 'Electrical Maintenance',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.ELECTRICIAN,
      phone: '+91 99999 55555',
      availability: Availability.ON_CALL,
      isEmergency: true,
      priority: ContactPriority.HIGH,
      location: 'On-site service',
      languages: ['Hindi', 'English']
    },
    {
      id: '9',
      name: 'Suresh Plumber',
      designation: 'Plumbing Services',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.PLUMBER,
      phone: '+91 88888 44444',
      availability: Availability.ON_CALL,
      isEmergency: true,
      priority: ContactPriority.HIGH,
      location: 'On-site service',
      languages: ['Hindi', 'Marathi']
    },
    {
      id: '3a',
      name: 'Dinesh Carpenter',
      designation: 'Carpentry Services',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.CARPENTER,
      phone: '+91 77777 55555',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      location: 'On-site service',
      languages: ['Hindi', 'Gujarati']
    },
    {
      id: '3b',
      name: 'AC Service Center',
      designation: 'Air Conditioning Repair',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.AC_TECHNICIAN,
      phone: '+91 99999 77777',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      location: 'External service'
    },
    {
      id: '3c',
      name: 'Kumar Lift Tech',
      designation: 'Lift Maintenance',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.LIFT_TECHNICIAN,
      phone: '+91 88888 66666',
      availability: Availability.ON_CALL,
      isEmergency: true,
      priority: ContactPriority.HIGH,
      location: 'On-site service',
      languages: ['Hindi', 'English', 'Telugu']
    },
    {
      id: '3d',
      name: 'Generator Operator',
      designation: 'Power Backup Services',
      department: ContactDepartment.MAINTENANCE,
      category: ContactCategory.GENERATOR_OPERATOR,
      phone: '+91 77777 88888',
      availability: Availability.ON_CALL,
      isEmergency: true,
      priority: ContactPriority.HIGH,
      location: 'Generator Room'
    },

    // Administration
    {
      id: '4',
      name: 'Mrs. Sunita Singh',
      designation: 'Society Secretary',
      department: ContactDepartment.COMMITTEE,
      category: ContactCategory.SECRETARY,
      phone: '+91 77777 66666',
      email: 'secretary@society.com',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      location: 'Society Office',
      languages: ['Hindi', 'English']
    },
    {
      id: '10',
      name: 'Meera Accountant',
      designation: 'Society Accountant',
      department: ContactDepartment.ADMINISTRATION,
      category: ContactCategory.ACCOUNTANT,
      phone: '+91 77777 33333',
      email: 'accounts@society.com',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      location: 'Accounts Office',
      languages: ['English', 'Hindi', 'Marathi']
    },
    {
      id: '4a',
      name: 'Mr. Anil Gupta',
      designation: 'Society Chairman',
      department: ContactDepartment.COMMITTEE,
      category: ContactCategory.CHAIRMAN,
      phone: '+91 99999 44444',
      email: 'chairman@society.com',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      location: 'Block C, Flat 501',
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: '4b',
      name: 'Mrs. Kavita Joshi',
      designation: 'Society Manager',
      department: ContactDepartment.ADMINISTRATION,
      category: ContactCategory.SOCIETY_MANAGER,
      phone: '+91 88888 33333',
      email: 'manager@society.com',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.HIGH,
      location: 'Society Office',
      languages: ['Hindi', 'English', 'Marathi']
    },
    {
      id: '4c',
      name: 'Reception Desk',
      designation: 'Society Reception',
      department: ContactDepartment.ADMINISTRATION,
      category: ContactCategory.RECEPTIONIST,
      phone: '+91 80 2345 6789',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.LOW,
      location: 'Main Lobby',
      languages: ['Hindi', 'English', 'Kannada']
    },

    // Utilities & External Services
    {
      id: '11',
      name: 'BESCOM Office',
      designation: 'Electricity Board',
      department: ContactDepartment.UTILITIES,
      category: ContactCategory.ELECTRICITY_BOARD,
      phone: '1912',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      description: 'Power supply issues and billing'
    },
    {
      id: '12',
      name: 'BWSSB',
      designation: 'Water Supply Board',
      department: ContactDepartment.UTILITIES,
      category: ContactCategory.WATER_SUPPLY,
      phone: '1916',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      description: 'Water supply and drainage issues'
    },
    {
      id: '13',
      name: 'Gas Agency',
      designation: 'LPG Gas Supply',
      department: ContactDepartment.UTILITIES,
      category: ContactCategory.GAS_AGENCY,
      phone: '+91 80 2567 8901',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'LPG cylinder booking and delivery'
    },
    {
      id: '14',
      name: 'ACT Fibernet',
      designation: 'Internet Service Provider',
      department: ContactDepartment.UTILITIES,
      category: ContactCategory.INTERNET_SERVICE,
      phone: '1800 419 1999',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'Internet connectivity issues'
    },

    // Cleaning & Services
    {
      id: '15',
      name: 'Lakshmi Housekeeping',
      designation: 'Housekeeping Head',
      department: ContactDepartment.CLEANING,
      category: ContactCategory.HOUSEKEEPING_HEAD,
      phone: '+91 99999 22222',
      availability: Availability.DAY_SHIFT,
      isEmergency: false,
      priority: ContactPriority.LOW,
      location: 'Service Area',
      languages: ['Hindi', 'Kannada']
    },
    {
      id: '16',
      name: 'Waste Collection',
      designation: 'Garbage Collection Service',
      department: ContactDepartment.CLEANING,
      category: ContactCategory.GARBAGE_COLLECTION,
      phone: '+91 88888 11111',
      availability: Availability.DAY_SHIFT,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'Daily waste collection service'
    },
    {
      id: '17',
      name: 'Parking Attendant',
      designation: 'Vehicle Parking Services',
      department: ContactDepartment.PARKING,
      category: ContactCategory.PARKING_ATTENDANT,
      phone: '+91 77777 99999',
      availability: Availability.DAY_SHIFT,
      isEmergency: false,
      priority: ContactPriority.LOW,
      location: 'Parking Area',
      languages: ['Hindi', 'English']
    },

    // Legal & Finance
    {
      id: '18',
      name: 'Adv. Rajesh Kumar',
      designation: 'Legal Advisor',
      department: ContactDepartment.LEGAL,
      category: ContactCategory.LEGAL_ADVISOR,
      phone: '+91 99999 11111',
      email: 'legal@society.com',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.MEDIUM,
      location: 'External consultant'
    },
    {
      id: '19',
      name: 'HDFC Bank',
      designation: 'Society Bank',
      department: ContactDepartment.FINANCE,
      category: ContactCategory.BANK_MANAGER,
      phone: '+91 80 6160 6161',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'Society banking and loan services'
    },

    // Vendors & Services
    {
      id: '20',
      name: 'Fresh Mart',
      designation: 'Grocery Delivery',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.GROCERY_VENDOR,
      phone: '+91 88888 00000',
      availability: Availability.BUSINESS_HOURS,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'Daily essentials delivery'
    },
    {
      id: '21',
      name: 'Nandini Milk',
      designation: 'Milk Delivery',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.MILK_VENDOR,
      phone: '+91 77777 00000',
      availability: Availability.DAY_SHIFT,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'Daily milk delivery service'
    },
    {
      id: '22',
      name: 'Ola/Uber Support',
      designation: 'Cab Services',
      department: ContactDepartment.EXTERNAL,
      category: ContactCategory.CAB_SERVICE,
      phone: '+91 80 7117 7117',
      availability: Availability.FULL_TIME,
      isEmergency: false,
      priority: ContactPriority.LOW,
      description: 'Taxi booking and support'
    }
  ];

  const filteredContacts = useMemo(() => {
    return emergencyContacts.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'ALL' || contact.department === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const getDepartmentIcon = (department: ContactDepartment) => {
    switch (department) {
      case ContactDepartment.SECURITY: return <FaShieldAlt />;
      case ContactDepartment.MAINTENANCE: return <FaTools />;
      case ContactDepartment.MEDICAL: return <FaMedkit />;
      case ContactDepartment.ADMINISTRATION: return <FaBuilding />;
      case ContactDepartment.COMMITTEE: return <FaUsers />;
      case ContactDepartment.UTILITIES: return <FaBolt />;
      default: return <FaCog />;
    }
  };

  const getAvailabilityText = (availability: Availability) => {
    switch (availability) {
      case Availability.FULL_TIME: return '24/7 Available';
      case Availability.BUSINESS_HOURS: return 'Business Hours';
      case Availability.DAY_SHIFT: return 'Day Shift';
      case Availability.NIGHT_SHIFT: return 'Night Shift';
      case Availability.ON_CALL: return 'On Call';
      case Availability.EMERGENCY_ONLY: return 'Emergency Only';
      default: return 'Available';
    }
  };

  const getQuickActions = (contact: EmergencyContact): QuickAction[] => {
    const actions: QuickAction[] = [];
    
    actions.push({
      type: 'CALL',
      label: 'Call',
      value: `tel:${contact.phone}`,
      icon: 'FaPhone'
    });
    
    actions.push({
      type: 'SMS',
      label: 'SMS',
      value: `sms:${contact.phone}`,
      icon: 'FaSms'
    });
    
    if (contact.phone.startsWith('+91') && contact.phone.length > 10) {
      actions.push({
        type: 'WHATSAPP',
        label: 'WhatsApp',
        value: `https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`,
        icon: 'FaWhatsapp'
      });
    }
    
    if (contact.email) {
      actions.push({
        type: 'EMAIL',
        label: 'Email',
        value: `mailto:${contact.email}`,
        icon: 'FaEnvelope'
      });
    }
    
    return actions;
  };

  const departmentFilters = [
    { key: 'ALL', label: 'All Contacts', icon: <FaCog /> },
    { key: ContactDepartment.SECURITY, label: 'Security', icon: <FaShieldAlt /> },
    { key: ContactDepartment.MEDICAL, label: 'Medical', icon: <FaMedkit /> },
    { key: ContactDepartment.MAINTENANCE, label: 'Maintenance', icon: <FaTools /> },
    { key: ContactDepartment.ADMINISTRATION, label: 'Administration', icon: <FaBuilding /> },
    { key: ContactDepartment.COMMITTEE, label: 'Committee', icon: <FaUsers /> },
    { key: ContactDepartment.UTILITIES, label: 'Utilities', icon: <FaBolt /> },
    { key: ContactDepartment.EXTERNAL, label: 'External Services', icon: <FaPhone /> },
  ];

  return (
    <HelpCenterContainer>
      <Header>
        <HeaderTitle>
          <FaExclamationTriangle />
          Help Center - Emergency Contacts
        </HeaderTitle>
        <p>One-stop solution for all emergency and non-emergency contacts in {currentSociety?.name || 'your society'}</p>
      </Header>

      <EmergencyBanner>
        <FaExclamationTriangle size={24} />
        <div>
          <strong>Emergency Numbers:</strong> Fire: 101 | Police: 100 | Ambulance: 102 | For life-threatening emergencies, call immediately!
        </div>
      </EmergencyBanner>

      <QuickEmergencyDial />

      <SearchAndFilterContainer>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Search contacts by name, designation, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon />
        </SearchBox>
        
        <FilterTabs>
          {departmentFilters.map((filter) => (
            <FilterTab
              key={filter.key}
              $active={selectedFilter === filter.key}
              onClick={() => setSelectedFilter(filter.key as ContactDepartment | 'ALL')}
            >
              {filter.icon}
              {filter.label}
            </FilterTab>
          ))}
        </FilterTabs>
      </SearchAndFilterContainer>

      <EmergencyProtocols />

      {filteredContacts.length === 0 ? (
        <EmptyState>
          <h3>No contacts found</h3>
          <p>Try adjusting your search terms or filters</p>
        </EmptyState>
      ) : (
        <ContactsGrid>
          {filteredContacts.map((contact) => {
            const quickActions = getQuickActions(contact);
            return (
              <ContactCard key={contact.id} $priority={contact.priority}>
                <ContactHeader>
                  <ContactInfo>
                    <ContactName>{contact.name}</ContactName>
                    <ContactDesignation>{contact.designation}</ContactDesignation>
                    {contact.isEmergency && <EmergencyBadge>Emergency</EmergencyBadge>}
                  </ContactInfo>
                  <DepartmentIcon $department={contact.department}>
                    {getDepartmentIcon(contact.department)}
                  </DepartmentIcon>
                </ContactHeader>

                <AvailabilityBadge $availability={contact.availability}>
                  {getAvailabilityText(contact.availability)}
                </AvailabilityBadge>

                {contact.location && (
                  <p style={{ margin: '0.5rem 0', color: '#7f8c8d', fontSize: '0.875rem' }}>
                    📍 {contact.location}
                  </p>
                )}

                {contact.description && (
                  <p style={{ margin: '0.5rem 0', color: '#7f8c8d', fontSize: '0.875rem' }}>
                    {contact.description}
                  </p>
                )}

                {contact.languages && contact.languages.length > 0 && (
                  <p style={{ margin: '0.5rem 0', color: '#7f8c8d', fontSize: '0.875rem' }}>
                    🗣️ Languages: {contact.languages.join(', ')}
                  </p>
                )}

                <ContactActions>
                  <CallButton href={quickActions.find(a => a.type === 'CALL')?.value}>
                    <FaPhone />
                    Call
                  </CallButton>
                  <SMSButton href={quickActions.find(a => a.type === 'SMS')?.value}>
                    <FaSms />
                    SMS
                  </SMSButton>
                  {quickActions.find(a => a.type === 'WHATSAPP') && (
                    <WhatsAppButton 
                      href={quickActions.find(a => a.type === 'WHATSAPP')?.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </WhatsAppButton>
                  )}
                  {quickActions.find(a => a.type === 'EMAIL') && (
                    <EmailButton href={quickActions.find(a => a.type === 'EMAIL')?.value}>
                      <FaEnvelope />
                      Email
                    </EmailButton>
                  )}
                </ContactActions>
              </ContactCard>
            );
          })}
        </ContactsGrid>
      )}
    </HelpCenterContainer>
  );
};

export default HelpCenterPage;