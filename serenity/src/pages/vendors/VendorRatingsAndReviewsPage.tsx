import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiStar,
  FiPlus,
  FiSearch,
  FiFilter,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiThumbsUp,
  FiThumbsDown,
  FiTrendingUp,
  FiAward,
  FiBarChart,
  FiEye,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Interfaces
interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  totalReviews: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

interface Review {
  id: number;
  vendorId: number;
  vendorName: string;
  reviewerName: string;
  reviewerRole: 'resident' | 'admin' | 'manager';
  rating: number;
  title: string;
  comment: string;
  serviceDate: Date;
  reviewDate: Date;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  serviceType: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
}

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const AddReviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[200]};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: 0 auto ${({ theme }) => theme.spacing[2]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ReviewCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[200]};
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ReviewerAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ReviewerDetails = styled.div`
  flex: 1;
`;

const ReviewerName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const Badge = styled.span<{ variant?: 'verified' | 'role' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'verified':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'role':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FiStar)<{ filled: boolean }>`
  color: ${({ filled, theme }) => filled ? theme.colors.warning[400] : theme.colors.gray[300]};
  fill: ${({ filled, theme }) => filled ? theme.colors.warning[400] : 'none'};
`;

const RatingValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ReviewTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ReviewContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ReviewText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProsCons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProsConsSection = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
`;

const ProsConsTitle = styled.h5`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ProsConsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProsConsItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  position: relative;
  padding-left: ${({ theme }) => theme.spacing[4]};

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary[500]};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReviewFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ServiceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const HelpfulSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HelpfulButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

// Add Review Modal Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const ModalContent = styled.form`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const RatingInput = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const RatingStar = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active, theme }) => active ? theme.colors.warning[400] : theme.colors.gray[300]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    color: ${({ theme }) => theme.colors.warning[400]};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  margin-top: ${({ theme }) => theme.spacing[4]};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const VendorRatingsAndReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    title: '',
    rating: 0,
    comment: '',
    serviceType: '',
    pros: '',
    cons: '',
    wouldRecommend: true,
    serviceDate: ''
  });

  // Mock data
  const mockVendors: Vendor[] = [
    { id: 1, name: 'QuickFix Plumbers', category: 'plumbing', rating: 4.8, totalReviews: 156, verificationStatus: 'verified' },
    { id: 2, name: 'PowerTech Electricians', category: 'electrical', rating: 4.6, totalReviews: 89, verificationStatus: 'verified' },
    { id: 3, name: 'CleanPro Services', category: 'cleaning', rating: 4.9, totalReviews: 234, verificationStatus: 'verified' },
    { id: 4, name: 'SecureGuard Agency', category: 'security', rating: 4.3, totalReviews: 78, verificationStatus: 'pending' },
    { id: 5, name: 'GreenThumb Gardeners', category: 'gardening', rating: 4.5, totalReviews: 67, verificationStatus: 'verified' }
  ];

  const mockReviews: Review[] = [
    {
      id: 1,
      vendorId: 1,
      vendorName: 'QuickFix Plumbers',
      reviewerName: 'Sarah Johnson',
      reviewerRole: 'resident',
      rating: 5,
      title: 'Excellent Emergency Service',
      comment: 'Called them for an emergency leak at 2 AM and they were there within 30 minutes. Professional, efficient, and reasonably priced. Highly recommend!',
      serviceDate: new Date('2024-01-15'),
      reviewDate: new Date('2024-01-16'),
      isVerifiedPurchase: true,
      helpfulVotes: 12,
      unhelpfulVotes: 1,
      serviceType: 'Emergency Repair',
      pros: ['Quick response', '24/7 availability', 'Professional staff', 'Fair pricing'],
      cons: ['None'],
      wouldRecommend: true
    },
    {
      id: 2,
      vendorId: 2,
      vendorName: 'PowerTech Electricians',
      reviewerName: 'Michael Chen',
      reviewerRole: 'admin',
      rating: 4,
      title: 'Good Work, Minor Delays',
      comment: 'They did a great job installing new lighting fixtures throughout our common areas. Work quality was excellent, but they were a day behind schedule.',
      serviceDate: new Date('2024-01-10'),
      reviewDate: new Date('2024-01-12'),
      isVerifiedPurchase: true,
      helpfulVotes: 8,
      unhelpfulVotes: 2,
      serviceType: 'Installation',
      pros: ['Quality work', 'Clean installation', 'Knowledgeable team'],
      cons: ['Slight delay', 'Could improve communication'],
      wouldRecommend: true
    },
    {
      id: 3,
      vendorId: 3,
      vendorName: 'CleanPro Services',
      reviewerName: 'Emma Davis',
      reviewerRole: 'resident',
      rating: 5,
      title: 'Outstanding Deep Cleaning',
      comment: 'Absolutely amazing service! They deep cleaned our entire apartment and it looks brand new. Eco-friendly products and very thorough work.',
      serviceDate: new Date('2024-01-08'),
      reviewDate: new Date('2024-01-09'),
      isVerifiedPurchase: true,
      helpfulVotes: 15,
      unhelpfulVotes: 0,
      serviceType: 'Deep Cleaning',
      pros: ['Eco-friendly products', 'Very thorough', 'Professional team', 'Great results'],
      cons: [],
      wouldRecommend: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVendors(mockVendors);
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = review.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVendor = selectedVendor === 'all' || review.vendorId.toString() === selectedVendor;
      const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
      
      return matchesSearch && matchesVendor && matchesRating;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default: // newest
          return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
      }
    });
  }, [reviews, searchQuery, selectedVendor, selectedRating, sortBy]);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;
    const verifiedReviews = reviews.filter(r => r.isVerifiedPurchase).length;
    const recommendationRate = reviews.filter(r => r.wouldRecommend).length / totalReviews * 100 || 0;

    return {
      totalReviews,
      avgRating: avgRating.toFixed(1),
      verifiedReviews,
      recommendationRate: recommendationRate.toFixed(0)
    };
  }, [reviews]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendorId || !formData.title || !formData.rating || !formData.comment) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedVendor = vendors.find(v => v.id.toString() === formData.vendorId);
    if (!selectedVendor) return;

    const newReview: Review = {
      id: reviews.length + 1,
      vendorId: parseInt(formData.vendorId),
      vendorName: selectedVendor.name,
      reviewerName: 'Current User', // In real app, get from auth context
      reviewerRole: 'resident',
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      serviceDate: new Date(formData.serviceDate),
      reviewDate: new Date(),
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      serviceType: formData.serviceType,
      pros: formData.pros.split(',').map(p => p.trim()).filter(p => p),
      cons: formData.cons.split(',').map(c => c.trim()).filter(c => c),
      wouldRecommend: formData.wouldRecommend
    };

    setReviews(prev => [newReview, ...prev]);
    setShowAddModal(false);
    setFormData({
      vendorId: '',
      title: '',
      rating: 0,
      comment: '',
      serviceType: '',
      pros: '',
      cons: '',
      wouldRecommend: true,
      serviceDate: ''
    });
    toast.success('Review added successfully!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  const handleHelpfulVote = (reviewId: number, isHelpful: boolean) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpfulVotes: isHelpful ? review.helpfulVotes + 1 : review.helpfulVotes,
          unhelpfulVotes: !isHelpful ? review.unhelpfulVotes + 1 : review.unhelpfulVotes
        };
      }
      return review;
    }));
    toast.success(isHelpful ? 'Marked as helpful' : 'Feedback recorded');
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div>Loading reviews...</div>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiStar size={32} />
          Vendor Ratings & Reviews
        </Title>
        <AddReviewButton onClick={() => setShowAddModal(true)}>
          <FiPlus size={20} />
          Add Review
        </AddReviewButton>
      </Header>

      <StatsSection>
        <StatCard>
          <StatIcon>
            <FiMessageCircle />
          </StatIcon>
          <StatValue>{stats.totalReviews}</StatValue>
          <StatLabel>Total Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <FiStar />
          </StatIcon>
          <StatValue>{stats.avgRating}</StatValue>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <FiCheckCircle />
          </StatIcon>
          <StatValue>{stats.verifiedReviews}</StatValue>
          <StatLabel>Verified Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <FiTrendingUp />
          </StatIcon>
          <StatValue>{stats.recommendationRate}%</StatValue>
          <StatLabel>Recommend Rate</StatLabel>
        </StatCard>
      </StatsSection>

      <FilterSection>
        <FilterRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <Select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="all">All Vendors</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </Select>
        </FilterRow>
      </FilterSection>

      {filteredReviews.length === 0 ? (
        <EmptyState>
          <FiMessageCircle size={64} />
          <h3>No reviews found</h3>
          <p>
            {searchQuery || selectedVendor !== 'all' || selectedRating !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Be the first to add a review!'}
          </p>
        </EmptyState>
      ) : (
        <ReviewsContainer>
          {filteredReviews.map(review => (
            <ReviewCard key={review.id}>
              <ReviewHeader>
                <ReviewerInfo>
                  <ReviewerAvatar>
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </ReviewerAvatar>
                  <ReviewerDetails>
                    <ReviewerName>{review.reviewerName}</ReviewerName>
                    <ReviewMeta>
                      <Badge variant="role">{review.reviewerRole}</Badge>
                      {review.isVerifiedPurchase && (
                        <Badge variant="verified">
                          <FiCheckCircle size={12} />
                          Verified Purchase
                        </Badge>
                      )}
                      <span>{review.reviewDate.toLocaleDateString()}</span>
                    </ReviewMeta>
                  </ReviewerDetails>
                </ReviewerInfo>
                <RatingSection>
                  <RatingValue>{review.rating}.0</RatingValue>
                  <StarRating>{renderStars(review.rating)}</StarRating>
                </RatingSection>
              </ReviewHeader>

              <ReviewTitle>{review.title}</ReviewTitle>
              
              <ReviewContent>
                <ReviewText>{review.comment}</ReviewText>
                
                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <ProsCons>
                    {review.pros.length > 0 && (
                      <ProsConsSection>
                        <ProsConsTitle>
                          <FiThumbsUp size={14} />
                          Pros
                        </ProsConsTitle>
                        <ProsConsList>
                          {review.pros.map((pro, index) => (
                            <ProsConsItem key={index}>{pro}</ProsConsItem>
                          ))}
                        </ProsConsList>
                      </ProsConsSection>
                    )}
                    
                    {review.cons.length > 0 && (
                      <ProsConsSection>
                        <ProsConsTitle>
                          <FiThumbsDown size={14} />
                          Cons
                        </ProsConsTitle>
                        <ProsConsList>
                          {review.cons.map((con, index) => (
                            <ProsConsItem key={index}>{con}</ProsConsItem>
                          ))}
                        </ProsConsList>
                      </ProsConsSection>
                    )}
                  </ProsCons>
                )}
              </ReviewContent>

              <ReviewFooter>
                <ServiceInfo>
                  <span><strong>Vendor:</strong> {review.vendorName}</span>
                  <span><strong>Service:</strong> {review.serviceType}</span>
                  <span><strong>Service Date:</strong> {review.serviceDate.toLocaleDateString()}</span>
                  {review.wouldRecommend && (
                    <Badge>
                      <FiAward size={12} />
                      Recommends
                    </Badge>
                  )}
                </ServiceInfo>
                
                <HelpfulSection>
                  <span>Was this helpful?</span>
                  <HelpfulButton onClick={() => handleHelpfulVote(review.id, true)}>
                    <FiThumbsUp size={14} />
                    {review.helpfulVotes}
                  </HelpfulButton>
                  <HelpfulButton onClick={() => handleHelpfulVote(review.id, false)}>
                    <FiThumbsDown size={14} />
                    {review.unhelpfulVotes}
                  </HelpfulButton>
                </HelpfulSection>
              </ReviewFooter>
            </ReviewCard>
          ))}
        </ReviewsContainer>
      )}

      {showAddModal && (
        <Overlay onClick={() => setShowAddModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add New Review</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <ModalContent onSubmit={handleAddReview}>
              <FormGroup>
                <Label>Vendor *</Label>
                <Select
                  value={formData.vendorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendorId: e.target.value }))}
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.category}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Rating *</Label>
                <RatingInput>
                  {[1, 2, 3, 4, 5].map(star => (
                    <RatingStar
                      key={star}
                      type="button"
                      active={star <= formData.rating}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    >
                      <FiStar size={24} fill={star <= formData.rating ? 'currentColor' : 'none'} />
                    </RatingStar>
                  ))}
                </RatingInput>
              </FormGroup>

              <FormGroup>
                <Label>Review Title *</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief title for your review"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Service Type</Label>
                <Input
                  type="text"
                  value={formData.serviceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                  placeholder="e.g., Emergency Repair, Installation, Maintenance"
                />
              </FormGroup>

              <FormGroup>
                <Label>Service Date</Label>
                <Input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceDate: e.target.value }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>Your Review *</Label>
                <TextArea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this vendor..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Pros (comma-separated)</Label>
                <Input
                  type="text"
                  value={formData.pros}
                  onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                  placeholder="Quick response, Professional staff, Fair pricing"
                />
              </FormGroup>

              <FormGroup>
                <Label>Cons (comma-separated)</Label>
                <Input
                  type="text"
                  value={formData.cons}
                  onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                  placeholder="Communication could be better, Slight delay"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.wouldRecommend}
                    onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  I would recommend this vendor
                </Label>
              </FormGroup>

              <SubmitButton type="submit">
                Submit Review
              </SubmitButton>
            </ModalContent>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default VendorRatingsAndReviewsPage;