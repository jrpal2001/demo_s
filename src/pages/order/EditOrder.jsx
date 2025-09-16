import { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  styled,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { fetchAvailability, fetchOrderById, updateOrder } from '@/api/admin';
import { fetchAllProductMasterSkus } from '@/api/productmaster.api';
import { useNavigate, useParams } from 'react-router-dom';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const StyledTextField = styled(TextField)(({ borderColor }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: borderColor,
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: borderColor,
    },
    '&.Mui-focused fieldset': {
      borderColor: borderColor,
    },
  },
}));

export default function EditOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await fetchOrderById(id);
        // Convert sizes array to flat fields for editing
        setOrder({
          ...data,
          orderItems: data.orderItems.map((item) => ({
            ...item,
            ...item.sizes,
            skuOptions: [],
            isLoading: false,
            availability: {
              xs: 0,
              s: 0,
              m: 0,
              l: 0,
              xl: 0,
              '2xl': 0,
              '3xl': 0,
              '4xl': 0,
              '5xl': 0,
              ...(item.availability || {}),
            },
          })),
        });
      } catch (e) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleOrderChange = (field, value) => {
    setOrder({ ...order, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newOrderItems = order.orderItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setOrder({ ...order, orderItems: newOrderItems });
  };

  const handleAddItem = () => {
    setOrder({
      ...order,
      orderItems: [
        ...order.orderItems,
        {
          skuCode: '',
          skuOptions: [],
          colour: '',
          gender: '',
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          '2xl': 0,
          '3xl': 0,
          '4xl': 0,
          '5xl': 0,
          isLoading: false,
          availability: {
            xs: 0,
            s: 0,
            m: 0,
            l: 0,
            xl: 0,
            '2xl': 0,
            '3xl': 0,
            '4xl': 0,
            '5xl': 0,
          },
        },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newOrderItems = order.orderItems.filter((_, i) => i !== index);
    setOrder({ ...order, orderItems: newOrderItems });
  };

  const handleSkuInput = async (index, value) => {
    if (value) {
      try {
        const response = await fetchAllProductMasterSkus({ search: value, page: 1, limit: 5 });
        setOrder((prevOrder) => ({
          ...prevOrder,
          orderItems: prevOrder.orderItems.map((item, i) =>
            i === index ? { ...item, skuOptions: response?.records || [] } : item,
          ),
        }));
      } catch (error) {
        // ignore
      }
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderItems: prevOrder.orderItems.map((item, i) =>
          i === index ? { ...item, skuOptions: [] } : item,
        ),
      }));
    }
  };

  const handleSkuChange = (index, newValue) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: prevOrder.orderItems.map((item, i) =>
        i === index
          ? {
              ...item,
              skuCode: newValue ? newValue.skuCode : '',
            }
          : item,
      ),
    }));
  };

  const handleCheckAvailability = async (index) => {
    const item = order.orderItems[index];
    if (!item.skuCode) {
      alert('Please select SKU Code before checking availability.');
      return;
    }

    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: prevOrder.orderItems.map((item, i) =>
        i === index ? { ...item, isLoading: true } : item,
      ),
    }));

    try {
      const availabilityData = await fetchAvailability(item.skuCode);
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderItems: prevOrder.orderItems.map((item, i) =>
          i === index
            ? {
                ...item,
                availability: availabilityData,
                isLoading: false,
              }
            : item,
        ),
      }));
    } catch (error) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderItems: prevOrder.orderItems.map((item, i) =>
          i === index ? { ...item, isLoading: false } : item,
        ),
      }));
    }
  };

  const getBorderColor = (quantity, available) => {
    if (quantity === 0) return 'initial';
    return quantity > available ? 'red' : 'green';
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Prepare the order data to send to the backend
    const orderData = {
      orderItems: order.orderItems.map((item) => ({
        skuCode: item.skuCode,
        colour: item.colour,
        gender: item.gender,
        sizes: {
          xs: item.xs,
          s: item.s,
          m: item.m,
          l: item.l,
          xl: item.xl,
          '2xl': item['2xl'],
          '3xl': item['3xl'],
          '4xl': item['4xl'],
          '5xl': item['5xl'],
        },
      })),
      poDate: order.poDate,
      orderId: order.orderId,
      poNumber: order.poNumber,
      orderDated: order.orderDated,
      customerCode: order.customerCode,
      salesExecutiveId: order.salesExecutiveId,
      customerName: order.customerName,
      deliveryDate: order.deliveryDate,
    };
    try {
      await updateOrder(id, orderData);
      navigate(-1);
    } catch (error) {
      alert('Failed to update order.');
    }
  };

  if (loading || !order)
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <CircularProgress />
      </div>
    );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Edit Order
      </Typography>
      <form onSubmit={handleUpdate}>
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
                onChange={(e) => handleOrderChange('poDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Order ID"
                value={order.orderId || ''}
                onChange={(e) => handleOrderChange('orderId', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="PO Number"
                value={order.poNumber || ''}
                onChange={(e) => handleOrderChange('poNumber', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Order Dated"
                type="date"
                value={order.orderDated || ''}
                onChange={(e) => handleOrderChange('orderDated', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Customer Code"
                value={order.customerCode || ''}
                onChange={(e) => handleOrderChange('customerCode', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Sales Executive ID"
                value={order.salesExecutiveId || ''}
                onChange={(e) => handleOrderChange('salesExecutiveId', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Customer Name"
                value={order.customerName || ''}
                onChange={(e) => handleOrderChange('customerName', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Delivery Date"
                type="date"
                value={order.deliveryDate || ''}
                onChange={(e) => handleOrderChange('deliveryDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </CardContent>
        </Card>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <Typography variant="h6">Order Items</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </div>
          {order.orderItems.map((item, index) => (
            <Card key={index} style={{ marginBottom: '20px' }}>
              <CardContent>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Typography variant="subtitle1">Item {index + 1}</Typography>
                  {order.orderItems.length > 1 && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<RemoveIcon />}
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <Autocomplete
                    options={item.skuOptions || []}
                    getOptionLabel={(option) => option.skuCode}
                    renderInput={(params) => (
                      <TextField {...params} label="SKU Code" variant="outlined" />
                    )}
                    onInputChange={(event, value) => handleSkuInput(index, value)}
                    onChange={(event, newValue) => handleSkuChange(index, newValue)}
                    value={
                      item.skuOptions
                        ? item.skuOptions.find((sku) => sku.skuCode === item.skuCode) || null
                        : null
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCheckAvailability(index)}
                    disabled={item.isLoading}
                  >
                    {item.isLoading ? <CircularProgress size={24} /> : 'Check Availability'}
                  </Button>
                </div>
                <Typography variant="subtitle2" gutterBottom>
                  Sizes
                </Typography>
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}
                >
                  {SIZES.map((size) => (
                    <StyledTextField
                      key={size}
                      label={size.toUpperCase()}
                      type="number"
                      value={item[size]}
                      onChange={(e) =>
                        handleItemChange(index, size, Number.parseInt(e.target.value) || 0)
                      }
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      borderColor={getBorderColor(item[size], item.availability[size])}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Update Order
          </Button>
        </div>
      </form>
    </div>
  );
}
