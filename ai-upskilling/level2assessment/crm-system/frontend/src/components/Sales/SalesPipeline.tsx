import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  DragIndicator,
  Edit,
  Delete,
  Visibility,
  AttachMoney,
  Person,
  CalendarToday,
} from '@mui/icons-material';

interface Opportunity {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  customerId: number;
}

interface SalesPipelineProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunityId: number) => void;
  onView: (opportunity: Opportunity) => void;
  onMoveStage: (opportunityId: string, newStage: string) => void;
}

const SalesPipeline: React.FC<SalesPipelineProps> = ({
  opportunities,
  onEdit,
  onDelete,
  onView,
  onMoveStage,
}) => {
  const stages = [
    { key: 'prospecting', label: 'Prospecting', color: 'primary' },
    { key: 'qualification', label: 'Qualification', color: 'info' },
    { key: 'proposal', label: 'Proposal', color: 'warning' },
    { key: 'negotiation', label: 'Negotiation', color: 'secondary' },
    { key: 'closed-won', label: 'Closed Won', color: 'success' },
    { key: 'closed-lost', label: 'Closed Lost', color: 'error' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStageColor = (stage: string) => {
    const stageConfig = stages.find(s => s.key === stage);
    return stageConfig?.color || 'primary';
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const getStageTotal = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + opp.value, 0);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sales Pipeline
      </Typography>
      
      <Grid container spacing={2}>
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.key);
          const stageTotal = getStageTotal(stage.key);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={stage.key}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {stage.label}
                    </Typography>
                    <Chip
                      label={stageOpportunities.length}
                      size="small"
                      color={stage.color as any}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {formatCurrency(stageTotal)}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(stageOpportunities.length / opportunities.length) * 100}
                      color={stage.color as any}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                  
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {stageOpportunities.map((opportunity) => (
                      <Card
                        key={opportunity.id}
                        sx={{
                          mb: 1,
                          p: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 2,
                          },
                        }}
                        onClick={() => onView(opportunity)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {opportunity.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <AttachMoney fontSize="small" color="success" />
                              <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                                {formatCurrency(opportunity.value)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(opportunity.expectedCloseDate)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={opportunity.probability}
                                color="primary"
                                sx={{ height: 2, borderRadius: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {opportunity.probability}% probability
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onView(opportunity);
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(opportunity);
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(opportunity.id);
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                  
                  {stageOpportunities.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No opportunities in this stage
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SalesPipeline; 