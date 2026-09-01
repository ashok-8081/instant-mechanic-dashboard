import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { bookingsApi } from "../api/endpoints/bookings";
import BookingStatusBadge from "../components/Bookings/BookingStatusBadge";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Bookings: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Inside the component:
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";

  // Initialize filters with search param:
  const [filters, setFilters] = useState({
    status: "",
    search: searchParam || "",
    dateFrom: "",
    dateTo: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bookings", page, limit],
    queryFn: () => bookingsApi.getBookings({ page, limit }),
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  // Function to handle status update
  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsApi.updateStatus(bookingId, newStatus);
      // Refetch the data to show updated status
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading bookings
      </div>
    );
  }

  const bookings = data?.data.data || [];
  const pagination = data?.data.pagination;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Service
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Mechanic
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Update Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Date/Time
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-mono">
                    {booking._id.slice(-6)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {booking.customerId?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {booking.vehicleId?.make} {booking.vehicleId?.model}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {booking.serviceId?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {booking.mechanicId?.name || "Unassigned"}
                  </td>
                  <td className="py-3 px-4">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusUpdate(booking._id, e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="MECHANIC_ON_WAY">On The Way</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    ${booking.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDate(booking.scheduledAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Bookings;
