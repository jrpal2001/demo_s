import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Box, Button, Divider, Grid2, MenuItem, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import PageContainer from '@/components/container/PageContainer.jsx';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import userPan from '@/assets/images/custom/markus-winkler-cO3mYlCBxzU-unsplash.jpg'
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import { dealerEdit, dealerViewById } from '@/api/admin';


const EditDealer = () => {
      const userType = useSelector(selectCurrentUserType);
    const Bcrumb = [
      { to: '/', title: 'Home' },
      { to: `/${userType}/vendors/2`, title: 'Dealers' },
      { title: 'Add' },
    ];

    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm();
    const { id } = useParams();
    const [sign, setSign] = useState();
    const [dealer, setDealer] = useState({});
    const [panFile, setPanFile] = useState(userPan || '');
    const [gstFile, setGstFile] = useState(userPan || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const panInputRef = useRef();
    const gstinInputRef = useRef();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const { oname, omobileNumber, oemailOrFax, odesignation, pname, pmobileNumber, pemailOrFax, pdesignation, pan, gstin, telephone, ...rest } = data;
            const newData = {
                telephone: `${telephone}`,
                ...rest,
                primaryContact: {
                    name: oname,
                    mobileNumber: omobileNumber,
                    emailOrFax: oemailOrFax,
                    designation: odesignation,
                },
                pointOfContactOperations: {
                    name: pname,
                    mobileNumber: pmobileNumber,
                    emailOrFax: pemailOrFax,
                    designation: pdesignation,
                },
                registrationDetails: {
                    pan: pan,
                    gstin: gstin,
                }
            }
            const response = await dealerEdit(id, newData);
            if(response) {
                toast.success("Dealer updated successfully");
                navigate(`/${userType}/vendors`);
            } else {
                toast.error("Dealer was not updated");
            }
        } catch (error) {
            error.data?.map( err => {
                setError(err.field, { type: 'manual', message: err.message });
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function handlePanSubmit(event) {
        const file = event.target.files[0];
        setPanFile(URL.createObjectURL(file));
    }

    function handleGSTSubmit(event) {
        const file = event.target.files[0];
        setGstFile(URL.createObjectURL(file));
    }

    function handleSign(event) {
        const file = event.target.files[0];
        setSign(URL.createObjectURL(file));
    }

    function handleCancel() {
        setIsSubmitting(false);
        navigate(`/${userType}/vendors/2`);
    }

    function onlyNumeric(event) {
        return event.target.value = event.target.value.replace(/[^0-9\+\-]/, "");
    }

    async function fetchDealer() {
        try {
            let response = await dealerViewById(id);
            setDealer(response);

            if (response && typeof response == 'object') {
                Object.entries(response).map(([key, value]) => {
                    if (key == '_id' || key == '__v') {

                    } else if ((value && typeof value == 'object') && (key == 'primaryContact' || key == 'pointOfContactOperations' || key == 'registrationDetails' || key == 'forOfficeUse')) {
                        Object.entries(value).map(([nestedKey, nestedValue]) => {
                            if (key == 'primaryContact') {
                                setValue(`p${nestedKey}`, nestedValue);
                            } else if (key == 'pointOfContactOperations') {
                                setValue(`o${nestedKey}`, nestedValue);
                            } else if (key == 'registrationDetails') {
                                if(nestedKey == 'supportingDocuments') {

                                } else {
                                    setValue(nestedKey, nestedValue);
                                }
                            } 
                        })
                    } else {
                        if (key == 'yearOfEstablishment') {
                            setValue(key, value.split('T')[0]);
                        } else {
                            setValue(key, value);
                        }
                    }
                });
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchDealer();
    }, [id])

    return (
        <PageContainer title="Samurai - Dealer Management">
            <Breadcrumb title="Dealer Management" items={Bcrumb} />
            <ParentCard title="Dealer Registration Form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container rowSpacing={2}>
                        {/* Primary Details */}
                        <Grid2 size={12}>
                            <Grid2 container columnSpacing={2}>
                                <Grid2 size={{ xs: 12 }}>
                                    <Typography textAlign="center" variant='h5'>Primary Details</Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="dealerName">
                                        Dealer Name <Typography sx={{ color: "red", display: "inline" }}> *</Typography>
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="dealerName"
                                        placeholer="Enter Dealer Name"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("dealerName", { required: "Dealer name is required" })}
                                        error={!!errors.dealerName}
                                        helperText={errors.dealerName?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="typeOfEntity">
                                        Type of Entity <Typography sx={{ color: "red", display: "inline" }}>*</Typography>
                                    </CustomFormLabel>
                                    <CustomSelect
                                        id="typeOfEntity"
                                        variant="outlined"
                                        defaultValue="default"
                                        fullWidth
                                        size="small"
                                        {...register("typeOfEntity", {
                                            required: "Type of Entity required",
                                            validate: (value) => {
                                                return value !== "default" || "Type of Entity is required"
                                            },
                                        })}
                                    >
                                        <MenuItem value="default" disabled>Select Type of Entity</MenuItem>
                                        <MenuItem value="individual">Individual</MenuItem>
                                        <MenuItem value="huf">HUF</MenuItem>
                                        <MenuItem value="partnership">Partnership</MenuItem>
                                        <MenuItem value="company">Company</MenuItem>
                                        <MenuItem value="trust">Trust</MenuItem>
                                        <MenuItem value="others">Others</MenuItem>
                                    </CustomSelect>
                                    {errors.typeOfEntity && (
                                        <Typography variant="body2" color="error" sx={{ marginX: '1rem', marginTop: "4px" }}>
                                            {errors.typeOfEntity.message}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="registeredOfficeAddress">
                                        Registered Office Address
                                        <Typography sx={{ color: "red", display: "inline" }}> *</Typography>
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="registeredOfficeAddress"
                                        placeholer="Enter Registered Office Address"
                                        type="textfield"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("registeredOfficeAddress", { required: "Office address is required" })}
                                        error={!!errors.registeredOfficeAddress}
                                        helperText={errors.registeredOfficeAddress?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="yearOfEstablishment">Year of Establishment</CustomFormLabel>
                                    <CustomTextField
                                        id="yearOfEstablishment"
                                        type="date"
                                        defaultValue="2000-01-01"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("yearOfEstablishment")}
                                        error={!!errors.yearOfEstablishment}
                                        helperText={errors.yearOfEstablishment?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="telephone">
                                        Contact Number
                                        <Typography sx={{ color: "red", display: "inline" }}>*</Typography>
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="telephone"
                                        placeholer="Enter Contact Number"
                                        type="tel"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("telephone", {
                                            required: "Contact number is required",
                                            pattern: {
                                                value: /^(\+\d{2})?\d{10}$/,
                                                message: "Contact number should be 10 digits"
                                            }
                                        })}
                                        onInput={onlyNumeric}
                                        error={!!errors.telephone}
                                        helperText={errors.telephone?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="websiteURL">Website URL</CustomFormLabel>
                                    <CustomTextField
                                        id="websiteURL"
                                        placeholer="Enter Website URL"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("websiteURL")}
                                        error={!!errors.websiteURL}
                                        helperText={errors.websiteURL?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="email">
                                        Email
                                        <Typography sx={{ color: "red", display: "inline" }}>*</Typography>
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="email"
                                        type="email"
                                        placeholer="Enter Email"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        autoComplete="email"
                                        {...register("email", { required: "Email is required" })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                </Grid2>
                                <Grid2 size={12} sx={{ marginTop: "2rem" }}>
                                    <Divider variant='middle' sx={{ backgroundColor: "#ecf2ff" }} />
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        {/* Primary Contact */}
                        <Grid2 size={12}>
                            <Grid2 container columnSpacing={2}>
                                <Grid2 size={12}>
                                    <Typography textAlign="center" variant='h5'>Primary Contact</Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="pname">Name</CustomFormLabel>
                                    <CustomTextField
                                        id="pname"
                                        placeholer="Enter Name"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("pname")}
                                        error={!!errors.pname}
                                        helperText={errors.pname?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="pdesignation">Designation</CustomFormLabel>
                                    <CustomTextField
                                        id="pdesignation"
                                        placeholer="Enter Designation"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("pdesignation")}
                                        error={!!errors.pdesignation}
                                        helperText={errors.pdesignation?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="pmobileNumber">Contact Number</CustomFormLabel>
                                    <CustomTextField
                                        id="pmobileNumber"
                                        placeholer="Enter Contact Number"
                                        type="tel"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("pmobileNumber", {
                                            pattern: { value: /^(\+\d{2})?\d{10}$/, message: "Number should be 10 digits" }
                                        })}
                                        onInput={onlyNumeric}
                                        error={!!errors.pmobileNumber}
                                        helperText={errors.pmobileNumber?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="pemailOrFax">Email or Fax</CustomFormLabel>
                                    <CustomTextField
                                        id="pemailOrFax"
                                        placeholer="Enter Email/Fax"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("pemailOrFax")}
                                        error={!!errors.pemailOrFax}
                                        helperText={errors.pemailOrFax?.message}
                                    />
                                </Grid2>
                                <Grid2 size={12} sx={{ marginTop: "2rem" }}>
                                    <Divider variant='middle' sx={{ backgroundColor: "#ecf2ff" }} />
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        {/* Point of Contact */}
                        <Grid2 size={12}>
                            <Grid2 container columnSpacing={2}>
                                <Grid2 size={12}>
                                    <Typography textAlign="center" variant='h5'>Point of Contact - Operations</Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="pname">Name</CustomFormLabel>
                                    <CustomTextField
                                        id="oname"
                                        placeholer="Enter Name"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("oname")}
                                        error={!!errors.oname}
                                        helperText={errors.oname?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="odesignation">Designation</CustomFormLabel>
                                    <CustomTextField
                                        id="odesignation"
                                        placeholer="Enter Designation"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("odesignation")}
                                        error={!!errors.odesignation}
                                        helperText={errors.odesignation?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="omobileNumber">Contact Number</CustomFormLabel>
                                    <CustomTextField
                                        id="omobileNumber"
                                        placeholer="Enter Contact Number"
                                        type="tel"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("omobileNumber", {
                                            pattern: { value: /^(\+\d{2})?\d{10}$/, message: "Number should be 10 digits" }
                                        })}
                                        onInput={onlyNumeric}
                                        error={!!errors.omobileNumber}
                                        helperText={errors.omobileNumber?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                    <CustomFormLabel htmlFor="oemailOrFax">Email or Fax</CustomFormLabel>
                                    <CustomTextField
                                        id="oemailOrFax"
                                        placeholer="Enter Email/Fax"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("oemailOrFax")}
                                        error={!!errors.oemailOrFax}
                                        helperText={errors.oemailOrFax?.message}
                                    />
                                </Grid2>
                                <Grid2 size={12} sx={{ marginTop: "2rem" }}>
                                    <Divider variant='middle' sx={{ backgroundColor: "#ecf2ff" }} />
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        {/* Registration Details */}
                        <Grid2 size={12}>
                            <Grid2 container columnSpacing={2}>
                                <Grid2 size={12}>
                                    <Typography textAlign="center" variant='h5'>Registration Details</Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 12, md: 6 }} >
                                    <Box sx={{
                                        height: "15rem",
                                        width: "25rem",
                                        backgroundColor: "#bdb3b34a",
                                        justifySelf: "center",
                                        marginY: "2rem",
                                        padding: "0.5rem",
                                        display: "flex",
                                        justifyContent: "center",
                                        overflowX: "clip"
                                    }}
                                        onClick={() => panInputRef.current.click()}
                                    >
                                        <CustomTextField
                                            type="file"
                                            inputRef={panInputRef}
                                            sx={{ display: "none" }}
                                            accept="image/*,application/pdf"
                                            onChange={handlePanSubmit}
                                        />
                                        {
                                            panFile && <img src={panFile} alt="pancard" style={{ height: "100%", width: "" }} />
                                        }
                                    </Box>
                                    <CustomFormLabel htmlFor="pan">
                                        PAN
                                        <Typography sx={{ color: "red", display: "inline" }}> *</Typography>
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="pan"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("pan", { required: "Pan Card is required" })}
                                        error={!!errors.pan}
                                        helperText={errors.pan?.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
                                    <Box sx={{
                                        height: "15rem",
                                        width: "15rem",
                                        justifySelf: "center",
                                        marginY: "2rem",
                                        backgroundColor: "#bdb3b34a",
                                        padding: "1rem",
                                        display: "flex",
                                        justifyContent: "center",
                                        overflowX: "clip"
                                    }}
                                        onClick={() => gstinInputRef.current.click()}
                                    >
                                        <CustomTextField
                                            type="file"
                                            inputRef={gstinInputRef}
                                            sx={{ display: "none" }}
                                            accept="image/*,application/pdf"
                                            onChange={handleGSTSubmit}
                                        />
                                        {
                                            gstFile && <img src={gstFile} alt="gst registration" style={{ height: "100%", width: "" }} />
                                        }
                                    </Box>
                                    <CustomFormLabel htmlFor="gstin">
                                        GSTIN
                                        <Typography sx={{ color: "red", display: "inline" }}> *</Typography>
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="gstin"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        {...register("gstin", { required: "GSTIN is required" })}
                                        error={!!errors.gstin}
                                        helperText={errors.gstin?.message}
                                    />
                                </Grid2>
                                <Grid2 size={12} sx={{ marginY: "1.5rem" }} >
                                    <Stack>
                                        {
                                            sign &&
                                            <Box sx={{
                                                height: "10rem",
                                                width: "20rem",
                                                justifySelf: "center",
                                                marginY: "2rem",
                                                backgroundColor: "#bdb3b34a",
                                                padding: "1rem",
                                                display: "flex",
                                                justifyContent: "center",
                                                overflowX: "clip"
                                            }}
                                            >
                                                <img src={sign} alt="dealer" style={{ width: "100%" }} />
                                            </Box>
                                        }
                                        <CustomFormLabel htmlFor="dealerSignatureWithSeal">Signature with Seal</CustomFormLabel>
                                        <CustomTextField
                                            id="dealerSignatureWithSeal"
                                            type="file"
                                            variant="outlined"
                                            placeholder="sdaf"
                                            onChange={handleSign}
                                        />
                                    </Stack>
                                </Grid2>
                            </Grid2>
                        </Grid2>

                        {/* Buttons */}
                        <Grid2 size={{ xs: 12 }} sx={{ marginTop: '1rem', display: 'flex' }} justifyContent="end">
                            <LoadingButton
                                loading={isSubmitting}
                                sx={{ marginRight: '0.5rem' }}
                                type='submit'
                            >
                                { isSubmitting ? "Submitting..." : "Save" }
                            </LoadingButton>
                            <Button type='reset' onClick={handleCancel}>Cancel</Button>
                        </Grid2>
                    </Grid2>
                </form>
            </ParentCard>
        </PageContainer>
    )
}

export default EditDealer;