"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, Tab, Box, Button, Fab, Chip } from "@mui/material"
import { IconEdit, IconEye, IconTrash, IconPlus } from "@tabler/icons"
import { toast } from "react-toastify"

import PageContainer from "@/components/container/PageContainer"
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb"
import CustomTable from "@/components/shared/CustomTable"
import { deleteNewOutward, fetchAllNewOutwards } from "@/api/assetOutward.api"
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: "/", title: "Home" }, { title: "New Outward Management" }]

const NewOutwardManagement = () => {
const userType = useSelector(selectCurrentUserType);
  const [selectedTab, setSelectedTab] = useState(0)
  const [outwards, setOutwards] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const navigate = useNavigate()

  // Map tab index to department name
  const departments = ["asset", "maintenance", "otherstore"]
  const currentDepartment = departments[selectedTab]

  const handleClickView = (id) => {
    navigate(`/${userType}/asset-outward/view/${currentDepartment}/${id}`);
  }

  const handleClickEdit = (id) => {
    navigate(`/${userType}/asset-outward/edit/${currentDepartment}/${id}`)
  }

  const handleClickCreate = () => {
    navigate(`/${userType}/asset-outward/create/${currentDepartment}`)
  }

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
    setPaginationModel({ page: 0, pageSize: 10 })
  }

  useEffect(() => {
    fetchOutwardData()
  }, [selectedTab, paginationModel])

  const fetchOutwardData = async () => {
    try {
      setLoading(true)
      setOutwards([])

      const response = await fetchAllNewOutwards(currentDepartment)
      console.log("🚀 ~ fetchOutwardData ~ response:", response)

      if (response) {
        // Ensure we have an array of data
        const outwardData = Array.isArray(response) ? response : [response]
        console.log("🚀 ~ fetchOutwardData ~ outwardData:", outwardData)

        if (outwardData.length === 0) {
          console.warn("No data received from API")
          setOutwards([])
          setTotalPages(0)
          return
        }

        // Create a simpler, flatter data structure for the table
        const flattenedData = outwardData.map((item) => {
          // Create a flat object with all needed fields
          return {
            _id: item._id,
            outwardNumber: item.outwardNumber || "-",
            requestedOn: item.requestedOn ? formatDate(item.requestedOn) : "-",
            itemsCount: item.items ? item.items.length : 0,
            issued: item.issued || false,
            status: item.issued ? "Issued" : "Pending",
            statusColor: item.issued ? "success" : "warning",
            issuedOn: item.issuedOn ? formatDate(item.issuedOn) : "-",
            issuedBy: item.issuedBy || "-",
          }
        })

        console.log("Flattened data for table:", flattenedData)
        setOutwards(flattenedData)
        setTotalPages(flattenedData.length || 0)
      } else {
        console.warn("No response from API")
        setOutwards([])
        setTotalPages(0)
      }
    } catch (error) {
      toast.error(`Error fetching ${currentDepartment} outward records: ${error.message}`)
      console.error("API Error:", error)
      setOutwards([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this outward record?")) {
      try {
        await deleteNewOutward(currentDepartment, id)
        toast.success("Outward record deleted successfully")
        fetchOutwardData() // Refresh the data
      } catch (error) {
        toast.error(`Error deleting outward record: ${error.message}`)
      }
    }
  }

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return "-"
    }
  }

  // Simplified column definitions that directly access the flattened data
  const getColumns = () => [
    { field: "id", headerName: "Sl No", width: 70, headerClassName: "custom-header" },
    {
      field: "outwardNumber",
      headerName: "OUTWARD NUMBER",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      headerClassName: "custom-header",
    },
    {
      field: "requestedOn",
      headerName: "REQUESTED DATE",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      headerClassName: "custom-header",
    },
    {
      field: "itemsCount",
      headerName: "ITEMS COUNT",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      headerClassName: "custom-header",
      type: "number",
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (!params || !params.row) return <Chip label="Pending" color="warning" size="small" />
        return <Chip label={params.row.status} color={params.row.statusColor} size="small" />
      },
    },
    {
      field: "issuedOn",
      headerName: "ISSUED DATE",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      headerClassName: "custom-header",
    },
    {
      field: "issuedBy",
      headerName: "ISSUED BY",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      headerClassName: "custom-header",
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (!params || !params.row || !params.row._id) return null

        return (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Fab color="primary" size="small">
              <IconEye onClick={() => handleClickView(params.row._id)} />
            </Fab>
            <Fab color="warning" size="small">
              <IconEdit onClick={() => handleClickEdit(params.row._id)} />
            </Fab>
            <Fab color="error" size="small">
              <IconTrash onClick={() => handleDelete(params.row._id)} />
            </Fab>
          </Box>
        )
      },
    },
  ]

  return (
    <PageContainer title="New Outward Management" description="New Outward Management">
      <Breadcrumb title="New Outward Management" items={BCrumb} />
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="outward tabs">
            <Tab label="Asset" />
            <Tab label="Maintenance" />
            <Tab label="Other Store" />
          </Tabs>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" startIcon={<IconPlus />} onClick={handleClickCreate}>
              Create New Outward
            </Button>
          </Box>

          {outwards.length === 0 && !loading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>No outward records found for {currentDepartment}</Box>
          ) : null}

          <CustomTable
            rows={outwards}
            columns={getColumns()}
            totalProducts={totalPages}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            loading={loading}
            getRowId={(row) => row?.id || row?._id || `temp-${Math.random().toString(36).substring(2, 9)}`}
          />
        </Box>
      </Box>
    </PageContainer>
  )
}

export default NewOutwardManagement
