"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { IconArrowLeft, IconEdit, IconChevronDown } from "@tabler/icons"

import PageContainer from "@/components/container/PageContainer"
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb"
import { toast } from "react-toastify"
import { fetchNewOutwardById } from "@/api/assetOutward.api"
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const NewOutwardDetails = () => {
const userType = useSelector(selectCurrentUserType);
  const { department, id } = useParams()
  const navigate = useNavigate()
  const [outward, setOutward] = useState(null)
  const [loading, setLoading] = useState(true)

  const BCrumb = [
    { to: "/", title: "Home" },
    { to: `/${userType}/asset-outward`, title: "New Outward Management" },
    { title: "Outward Details" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetchNewOutwardById(department, id)
        console.log("🚀 ~ fetchData ~ response:", response)

        if (response && response.data) {
          setOutward(response.data)
        } else {
          toast.error("Failed to fetch outward details")
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`)
        console.error("Error fetching outward details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (department && id) {
      fetchData()
    }
  }, [department, id])

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "-"
    }
  }

  const handleBack = () => {
    navigate(`/${userType}/asset-outward`);
  }

  const handleEdit = () => {
    navigate(`/${userType}/asset-outward/edit/${department}/${id}`);
  }

  // Check if any items have issue logs
  const hasIssueLogs = (items) => {
    if (!items) return false
    return items.some((item) => item.issueLogs && item.issueLogs.length > 0)
  }

  if (loading) {
    return (
      <PageContainer title="New Outward Details" description="View new outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  if (!outward) {
    return (
      <PageContainer title="New Outward Details" description="View new outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6" color="error">
            Outward record not found
          </Typography>
        </Box>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="New Outward Details" description="View new outward details">
      <Breadcrumb title="New Outward Details" items={BCrumb} />

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={handleBack}>
          Back to List
        </Button>
        <Button variant="contained" color="primary" startIcon={<IconEdit />} onClick={handleEdit}>
          Edit Outward
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {department?.charAt(0).toUpperCase() + department?.slice(1)} Outward Details
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Outward Number:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {outward.outwardNumber}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Requested On:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(outward.requestedOn)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Status:
              </Typography>
              <Chip
                label={outward.issued ? "Issued" : "Pending"}
                color={outward.issued ? "success" : "warning"}
                size="small"
              />
            </Grid>

            {outward.issued && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Issued On:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(outward.issuedOn)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Issued By:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {outward.issuedBy || "-"}
                  </Typography>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Outwarded To:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {outward.outwardedTo || "-"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Items ({outward.items?.length || 0})
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Code</TableCell>
                  <TableCell align="right">Requested Quantity</TableCell>
                  <TableCell align="right">Issued Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Fulfillment %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outward.items &&
                  outward.items.map((item, index) => {
                    const fulfillmentPercentage =
                      item.requestedQuantity > 0 ? Math.round((item.issuedQuantity / item.requestedQuantity) * 100) : 0

                    return (
                      <TableRow key={item._id || index}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell align="right">{item.requestedQuantity}</TableCell>
                        <TableCell align="right">{item.issuedQuantity}</TableCell>
                        <TableCell>{item.unit || "-"}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${fulfillmentPercentage}%`}
                            color={
                              fulfillmentPercentage === 100
                                ? "success"
                                : fulfillmentPercentage > 0
                                  ? "warning"
                                  : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                {(!outward.items || outward.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Issue Logs Section */}
          {hasIssueLogs(outward.items) && (
            <Box sx={{ mt: 4 }}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<IconChevronDown />}
                  aria-controls="issue-logs-content"
                  id="issue-logs-header"
                >
                  <Typography variant="h6">Issue History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item Code</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell>Issued At</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {outward.items.map((item) =>
                          item.issueLogs && item.issueLogs.length > 0
                            ? item.issueLogs.map((log, logIndex) => (
                                <TableRow key={`${item._id}-log-${logIndex}`}>
                                  <TableCell>{item.code}</TableCell>
                                  <TableCell align="right">{log.quantity}</TableCell>
                                  <TableCell>{formatDate(log.issuedAt)}</TableCell>
                                  <TableCell>{log.notes || "-"}</TableCell>
                                </TableRow>
                              ))
                            : null,
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {/* Item Details with Issue Logs */}
          {outward.items && outward.items.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Item Details
              </Typography>

              {outward.items.map((item, index) => (
                <Accordion key={item._id || index} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls={`item-${index}-content`}
                    id={`item-${index}-header`}
                  >
                    <Typography>
                      {item.code} - Requested: {item.requestedQuantity}, Issued: {item.issuedQuantity}{" "}
                      {item.unit && `(${item.unit})`}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {item.issueLogs && item.issueLogs.length > 0 ? (
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell>Issued At</TableCell>
                              <TableCell>Notes</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.issueLogs.map((log, logIndex) => (
                              <TableRow key={`detail-${item._id}-log-${logIndex}`}>
                                <TableCell align="right">{log.quantity}</TableCell>
                                <TableCell>{formatDate(log.issuedAt)}</TableCell>
                                <TableCell>{log.notes || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No issue history available for this item.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default NewOutwardDetails
