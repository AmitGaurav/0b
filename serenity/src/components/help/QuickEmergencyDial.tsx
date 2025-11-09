import React from 'react';
import styled from 'styled-components';
import { FaFire, FaShieldAlt, FaAmbulance, FaPhoneAlt } from 'react-icons/fa';

const QuickDialContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const QuickDialHeader = styled.h3`
  color: #2c3e50;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
`;

const QuickDialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const EmergencyButton = styled.a<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.$color};
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ServiceNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const ServiceName = styled.span`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const QuickEmergencyDial: React.FC = () => {
  const emergencyNumbers = [
    {
      name: 'Police',
      number: '100',
      icon: <FaShieldAlt size={20} />,
      color: '#34495e',
      description: 'Police Emergency'
    },
    {
      name: 'Fire Brigade',
      number: '101',
      icon: <FaFire size={20} />,
      color: '#e74c3c',
      description: 'Fire Emergency'
    },
    {
      name: 'Ambulance',
      number: '102',
      icon: <FaAmbulance size={20} />,
      color: '#27ae60',
      description: 'Medical Emergency'
    },
    {
      name: 'Security',
      number: '+91 98765 43210',
      icon: <FaShieldAlt size={20} />,
      color: '#2980b9',
      description: 'Society Security'
    }
  ];

  return (
    <QuickDialContainer>
      <QuickDialHeader>
        <FaPhoneAlt />
        Quick Emergency Dial
      </QuickDialHeader>
      <QuickDialGrid>
        {emergencyNumbers.map((service) => (
          <EmergencyButton
            key={service.number}
            href={`tel:${service.number}`}
            $color={service.color}
            title={`Call ${service.description}`}
          >
            {service.icon}
            <div>
              <div>
                <ServiceNumber>{service.number}</ServiceNumber>
              </div>
              <div>
                <ServiceName>{service.name}</ServiceName>
              </div>
            </div>
          </EmergencyButton>
        ))}
      </QuickDialGrid>
    </QuickDialContainer>
  );
};

export default QuickEmergencyDial;