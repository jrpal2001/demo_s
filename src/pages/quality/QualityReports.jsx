import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchQualityReports, resolveQualityReport } from '@/api/qualityReport.api';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export default function QualityReports() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [operational, setOperational] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [resolving, setResolving] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewReport, setViewReport] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        operational,
      };
      const data = await fetchQualityReports(params);
      console.log('🚀 ~ fetchReports ~ data:', data);
      setReports(data.reports || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.log('error ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [page, rowsPerPage, operational]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOperationalToggle = (event) => {
    setOperational(event.target.checked);
    setPage(0);
  };

  const handleOpenResolve = (report) => {
    setSelectedReport(report);
    setResolutionRemarks('');
    setResolveDialogOpen(true);
  };

  const handleCloseResolve = () => {
    setResolveDialogOpen(false);
    setSelectedReport(null);
    setResolutionRemarks('');
  };

  const handleResolve = async () => {
    if (!selectedReport) return;
    setResolving(true);
    try {
      await resolveQualityReport(selectedReport._id, resolutionRemarks);
      handleCloseResolve();
      fetchReports();
    } catch (_) {
      // handle error
    } finally {
      setResolving(false);
    }
  };

  const handleOpenView = (report) => {
    setViewReport(report);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setViewReport(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quality Reports
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="body1" mr={1}>
          Operational Only
        </Typography>
        <Switch checked={operational} onChange={handleOperationalToggle} color="primary" />
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Departments</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Reported At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    {report.departmentsResponsible?.map((dept) => (
                      <Chip key={dept} label={dept} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>{report.reportedBy?.name || report.reportedBy}</TableCell>
                  <TableCell>{new Date(report.reportedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {report.resolved ? (
                      <Chip label="Resolved" color="success" size="small" />
                    ) : (
                      <Chip label="Unresolved" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenView(report)}>
                      <VisibilityIcon />
                    </IconButton>
                    {!report.resolved && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenResolve(report)}
                        sx={{ ml: 1 }}
                      >
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {loading ? 'Loading...' : 'No reports found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle>Quality Report Details</DialogTitle>
        <DialogContent>
          {viewReport && (
            <Box>
              <Typography variant="h6">{viewReport.title}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                {viewReport.description}
              </Typography>
              <Box mb={2}>
                <Chip
                  label={viewReport.resolved ? 'Resolved' : 'Unresolved'}
                  color={viewReport.resolved ? 'success' : 'warning'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                {viewReport.operational && (
                  <Chip label="Operational" color="primary" size="small" />
                )}
              </Box>
              <Typography variant="body2">
                <b>Departments:</b> {viewReport.departmentsResponsible?.join(', ')}
              </Typography>
              <Typography variant="body2">
                <b>Reported By:</b> {viewReport.reportedBy?.name || viewReport.reportedBy}
              </Typography>
              <Typography variant="body2">
                <b>Reported At:</b> {new Date(viewReport.reportedAt).toLocaleString()}
              </Typography>
              {viewReport.resolved && (
                <>
                  <Typography variant="body2">
                    <b>Resolution Remarks:</b> {viewReport.resolutionRemarks}
                  </Typography>
                  <Typography variant="body2">
                    <b>Resolved At:</b>{' '}
                    {viewReport.resolvedAt ? new Date(viewReport.resolvedAt).toLocaleString() : '-'}
                  </Typography>
                </>
              )}
              <Box mt={2}>
                <Typography variant="subtitle2">Images:</Typography>
                {viewReport.images && viewReport.images.length > 0 ? (
                  <Grid container spacing={2} mt={1}>
                    {viewReport.images.map((img, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <img
                          src={img}
                          alt={`Quality Report ${idx + 1}`}
                          style={{
                            width: '100%',
                            borderRadius: 8,
                            objectFit: 'cover',
                            maxHeight: 180,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2">No images available.</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onClose={handleCloseResolve}>
        <DialogTitle>Resolve Quality Report</DialogTitle>
        <DialogContent>
          <TextField
            label="Resolution Remarks"
            value={resolutionRemarks}
            onChange={(e) => setResolutionRemarks(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResolve} disabled={resolving}>
            Cancel
          </Button>
          <Button
            onClick={handleResolve}
            color="primary"
            variant="contained"
            disabled={resolving || !resolutionRemarks.trim()}
          >
            {resolving ? 'Resolving...' : 'Resolve'}
          </Button>
        </DialogActions>
      </Dialog>

      {viewReport && viewReport.images && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={viewReport.images.map((src) => ({ src }))}
          index={lightboxIndex}
          plugins={[Zoom]}
        />
      )}
    </Box>
  );
}
