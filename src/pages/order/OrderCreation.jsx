import { useState } from 'react';
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
import { fetchAvailability, createOrder } from '@/api/admin';
import { fetchAllProductMasterSkus } from '@/api/productmaster.api';
import { useNavigate } from 'react-router-dom';

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

function OrderCreation() {
  const [order, setOrder] = useState({
    poDate: new Date().toISOString().split('T')[0],
    orderId: '',
    poNumber: '',
    orderDated: new Date().toISOString().split('T')[0],
    customerCode: '',
    salesExecutiveId: '',
    customerName: '',
    deliveryDate: '',
    orderItems: [
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
  const navigate = useNavigate();

  // Removed unused skuCodes

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

  const handleCreate = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (
      !order.poDate ||
      !order.orderId ||
      !order.poNumber ||
      !order.orderDated ||
      !order.customerCode ||
      !order.salesExecutiveId ||
      !order.customerName ||
      !order.deliveryDate
    ) {
      alert('Please fill all the required fields.');
      return;
    }

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
    console.log('🚀 ~ handleCreate ~ orderData:', orderData);

    try {
      // Call your backend API to create the order
      const createdOrder = await createOrder(orderData);

      if (createdOrder) {
        console.log('Order created successfully:', createdOrder);
        navigate(-1);
      } else {
        console.error('Failed to create order');
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order.');
    }
  };

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

  const handleSkuInput = async (index, value) => {
    if (value) {
      try {
        const response = await fetchAllProductMasterSkus({ search: value, page: 1, limit: 5 });
        console.log('🚀 ~ handleSkuInput ~ response:', response);

        setOrder((prevOrder) => ({
          ...prevOrder,
          orderItems: prevOrder.orderItems.map((item, i) =>
            i === index ? { ...item, skuOptions: response?.records || [] } : item,
          ),
        }));
      } catch (error) {
        console.error('Error fetching SKU options:', error);
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
      console.error('Error fetching availability:', error);
      alert('Failed to fetch availability. Please try again.');
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Create New Order
      </Typography>
      <form onSubmit={handleCreate}>
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
                value={order.poDate}
                onChange={(e) => handleOrderChange('poDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Order ID"
                value={order.orderId}
                onChange={(e) => handleOrderChange('orderId', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="PO Number"
                value={order.poNumber}
                onChange={(e) => handleOrderChange('poNumber', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Order Dated"
                type="date"
                value={order.orderDated}
                onChange={(e) => handleOrderChange('orderDated', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Customer Code"
                value={order.customerCode}
                onChange={(e) => handleOrderChange('customerCode', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Sales Executive ID"
                value={order.salesExecutiveId}
                onChange={(e) => handleOrderChange('salesExecutiveId', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Customer Name"
                value={order.customerName}
                onChange={(e) => handleOrderChange('customerName', e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Delivery Date"
                type="date"
                value={order.deliveryDate}
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
                    <div key={size}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Available: {item.availability[size]}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom>
                        Pending : {item.availability[size] - item[size]}
                      </Typography>
                      <StyledTextField
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}

export default OrderCreation;
