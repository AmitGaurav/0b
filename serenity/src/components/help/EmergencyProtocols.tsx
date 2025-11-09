import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaFire, FaShieldAlt, FaMedkit, FaWrench, FaBolt, FaWater, FaPhoneAlt } from 'react-icons/fa';
import { EmergencyProtocol, ContactCategory, ContactPriority } from '../../types/helpCenter';

const ProtocolsContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ProtocolsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e6ed;
`;

const ProtocolsTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
`;

const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProtocolCard = styled.div<{ $priority: ContactPriority }>`
  border: 2px solid ${props => {
    switch (props.$priority) {
      case ContactPriority.CRITICAL: return '#e74c3c';
      case ContactPriority.HIGH: return '#f39c12';
      default: return '#3498db';
    }
  }};
  border-radius: 10px;
  padding: 1.5rem;
  background: ${props => {
    switch (props.$priority) {
      case ContactPriority.CRITICAL: return '#fdf2f2';
      case ContactPriority.HIGH: return '#fef9e7';
      default: return '#f8fafc';
    }
  }};
`;

const ProtocolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ProtocolIcon = styled.div<{ $color: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const ProtocolTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.125rem;
`;

const ProtocolSteps = styled.ol`
  margin: 0;
  padding-left: 1.25rem;
  color: #2c3e50;
`;

const ProtocolStep = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const ImportantNote = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  
  strong {
    color: #856404;
  }
  
  p {
    margin: 0;
    color: #856404;
    font-size: 0.875rem;
  }
`;

const EmergencyProtocols: React.FC = () => {
  const protocols: EmergencyProtocol[] = [
    {
      id: '1',
      title: 'Fire Emergency',
      category: ContactCategory.FIRE_BRIGADE,
      priority: ContactPriority.CRITICAL,
      steps: [
        'Stay calm and do not panic',
        'Immediately call Fire Brigade (101)',
        'Call Society Security (+91 98765 43210)',
        'Alert neighbors by shouting "FIRE"',
        'If possible, turn off electrical mains',
        'Evacuate using stairs only (never use elevators)',
        'Gather at designated assembly point',
        'Do not re-enter until authorities give clearance'
      ],
      importantContacts: ['1', '5']
    },
    {
      id: '2',
      title: 'Medical Emergency',
      category: ContactCategory.AMBULANCE,
      priority: ContactPriority.CRITICAL,
      steps: [
        'Check if person is conscious and breathing',
        'Call Ambulance immediately (102)',
        'Call Society Doctor (+91 99999 88888)',
        'Provide first aid if trained',
        'Do not move injured person unless necessary',
        'Keep person warm and comfortable',
        'Note time of incident and symptoms',
        'Guide ambulance to exact location'
      ],
      importantContacts: ['2', '7']
    },
    {
      id: '3',
      title: 'Security Threat',
      category: ContactCategory.POLICE,
      priority: ContactPriority.CRITICAL,
      steps: [
        'Ensure your immediate safety first',
        'Call Police Control Room (100)',
        'Contact Chief Security (+91 98765 43210)',
        'Lock doors and stay inside if possible',
        'Do not confront the threat directly',
        'Note description of suspicious persons/vehicles',
        'Inform neighbors discreetly',
        'Cooperate with authorities when they arrive'
      ],
      importantContacts: ['1', '6']
    },
    {
      id: '4',
      title: 'Power Outage',
      category: ContactCategory.ELECTRICIAN,
      priority: ContactPriority.HIGH,
      steps: [
        'Check if outage is building-wide or area-wide',
        'Contact Maintenance Head (+91 88888 77777)',
        'Call Electrician (+91 99999 55555) if needed',
        'Check main electrical panel (if accessible)',
        'Report to Electricity Board if area-wide',
        'Use emergency lighting/flashlights',
        'Avoid using candles or open flames',
        'Inform elderly or disabled residents'
      ],
      importantContacts: ['3', '8']
    },
    {
      id: '5',
      title: 'Water Leak/Plumbing',
      category: ContactCategory.PLUMBER,
      priority: ContactPriority.HIGH,
      steps: [
        'Turn off main water supply if major leak',
        'Contact Maintenance Head (+91 88888 77777)',
        'Call Plumber (+91 88888 44444) immediately',
        'Move valuables away from water',
        'Document damage with photos',
        'Inform affected neighbors',
        'Use buckets to collect water if possible',
        'Contact insurance if significant damage'
      ],
      importantContacts: ['3', '9']
    },
    {
      id: '6',
      title: 'Lift Breakdown',
      category: ContactCategory.LIFT_TECHNICIAN,
      priority: ContactPriority.MEDIUM,
      steps: [
        'Press alarm button inside lift',
        'Call for help loudly',
        'Contact Security (+91 98765 43210)',
        'Call Maintenance Head (+91 88888 77777)',
        'Stay calm and conserve energy',
        'Do not try to force doors open',
        'Use emergency phone if available',
        'Wait for professional help'
      ],
      importantContacts: ['1', '3']
    }
  ];

  const getCategoryIcon = (category: ContactCategory) => {
    switch (category) {
      case ContactCategory.FIRE_BRIGADE: return <FaFire />;
      case ContactCategory.AMBULANCE: return <FaMedkit />;
      case ContactCategory.POLICE: return <FaShieldAlt />;
      case ContactCategory.ELECTRICIAN: return <FaBolt />;
      case ContactCategory.PLUMBER: return <FaWater />;
      default: return <FaWrench />;
    }
  };

  const getCategoryColor = (category: ContactCategory) => {
    switch (category) {
      case ContactCategory.FIRE_BRIGADE: return '#e74c3c';
      case ContactCategory.AMBULANCE: return '#e74c3c';
      case ContactCategory.POLICE: return '#34495e';
      case ContactCategory.ELECTRICIAN: return '#f39c12';
      case ContactCategory.PLUMBER: return '#3498db';
      default: return '#95a5a6';
    }
  };

  return (
    <ProtocolsContainer>
      <ProtocolsHeader>
        <FaExclamationTriangle size={24} color="#e74c3c" />
        <ProtocolsTitle>Emergency Response Protocols</ProtocolsTitle>
      </ProtocolsHeader>
      
      <ProtocolsGrid>
        {protocols.map((protocol) => (
          <ProtocolCard key={protocol.id} $priority={protocol.priority}>
            <ProtocolHeader>
              <ProtocolIcon $color={getCategoryColor(protocol.category)}>
                {getCategoryIcon(protocol.category)}
              </ProtocolIcon>
              <ProtocolTitle>{protocol.title}</ProtocolTitle>
            </ProtocolHeader>
            
            <ProtocolSteps>
              {protocol.steps.map((step, index) => (
                <ProtocolStep key={index}>{step}</ProtocolStep>
              ))}
            </ProtocolSteps>
            
            {protocol.priority === ContactPriority.CRITICAL && (
              <ImportantNote>
                <strong>⚠️ CRITICAL EMERGENCY</strong>
                <p>Call emergency services immediately. Time is crucial in these situations.</p>
              </ImportantNote>
            )}
          </ProtocolCard>
        ))}
      </ProtocolsGrid>
    </ProtocolsContainer>
  );
};

export default EmergencyProtocols;