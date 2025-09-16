import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, CircularProgress, Button } from '@mui/material';
import { fetchOrderById } from '@/api/admin';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

export default function ViewOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (e) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <CircularProgress />
      </div>
    );
  if (!order) return <Typography color="error">Order not found</Typography>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        View Order
      </Typography>
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <TextField
              label="PO Date"
              type="date"
              value={order.poDate || ''}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              label="Order ID"
              value={order.orderId || ''}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              label="PO Number"
              value={order.poNumber || ''}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              label="Order Dated"
              type="date"
              value={order.orderDated || ''}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              label="Customer Code"
              value={order.customerCode || ''}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              label="Sales Executive ID"
              value={order.salesExecutiveId || ''}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              label="Customer Name"
              value={order.customerName || ''}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              label="Delivery Date"
              type="date"
              value={order.deliveryDate || ''}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </div>
        </CardContent>
      </Card>
      <div style={{ marginBottom: '20px' }}>
        <Typography variant="h6">Order Items</Typography>
        {order.orderItems &&
          order.orderItems.map((item, index) => (
            <Card key={index} style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="subtitle1">Item {index + 1}</Typography>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <TextField
                    label="SKU Code"
                    value={item.skuCode || ''}
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Colour"
                    value={item.colour || ''}
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Gender"
                    value={item.gender || ''}
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                </div>
                <Typography variant="subtitle2" gutterBottom>
                  Sizes
                </Typography>
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}
                >
                  {SIZES.map((size) => (
                    <TextField
                      key={size}
                      label={size.toUpperCase()}
                      type="number"
                      value={item.sizes ? item.sizes[size] : 0}
                      fullWidth
                      variant="outlined"
                      disabled
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
