import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  MusicalNoteIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CloudArrowUpIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import { adminAPI, trackAPI, bookingAPI } from '../services/api'
import Button3D from '../components/ui/Button3D'
import TrackUploadForm from '../components/admin/TrackUploadForm'
import toast from 'react-hot-toast'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [tracks, setTracks] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, tracksRes, bookingsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        trackAPI.getAll({ limit: 10, sort: '-createdAt' }),
        bookingAPI.getAll({ limit: 10, sort: '-createdAt' }),
        adminAPI.getUsers({ limit: 10 })
      ])

      setStats(statsRes.data)
      setTracks(tracksRes.data.tracks)
      setBookings(bookingsRes.data.bookings)
      setUsers(usersRes.data.users)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrack = async (id) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      try {
        await trackAPI.delete(id)
        setTracks(tracks.filter(track => track._id !== id))
        toast.success('Track deleted successfully')
      } catch (error) {
        toast.error('Failed to delete track')
      }
    }
  }

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status)
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status } : booking
      ))
      toast.success('Booking status updated')
    } catch (error) {
      toast.error('Failed to update booking status')
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-text-secondary">{title}</div>
    </motion.div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'tracks', label: 'Tracks', icon: MusicalNoteIcon },
    { id: 'bookings', label: 'Bookings', icon: CalendarDaysIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
  ]

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-text-secondary">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">Welcome back, {user.name}!</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button3D
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Track
            </Button3D>
            <Button3D variant="outline" onClick={fetchDashboardData}>
              Refresh
            </Button3D>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tracks"
            value={stats?.totalTracks || 0}
            change={12}
            icon={MusicalNoteIcon}
            color="bg-gradient-to-r from-primary to-purple-600"
          />
          <StatCard
            title="Active Bookings"
            value={stats?.activeBookings || 0}
            change={8}
            icon={CalendarDaysIcon}
            color="bg-gradient-to-r from-accent-pink to-purple-600"
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change={15}
            icon={UsersIcon}
            color="bg-gradient-to-r from-secondary to-cyan-600"
          />
          <StatCard
            title="Revenue"
            value={`$${stats?.revenue || 0}`}
            change={22}
            icon={CurrencyDollarIcon}
            color="bg-gradient-to-r from-primary to-blue-600"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'glass-effect hover:bg-white/5'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="font-heading text-xl font-bold mb-6">Revenue Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.revenueData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#12121A', borderColor: '#333' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#7B42F6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <h3 className="font-heading text-xl font-bold mb-6">Track Genres</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.genreDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats?.genreDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={[
                            '#7B42F6',
                            '#00F3FF',
                            '#FF2E9D',
                            '#8B5CF6',
                            '#06D6A0',
                            '#FFD166'
                          ][index % 6]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#12121A', borderColor: '#333' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New track uploaded', user: 'Sarah Chen', time: '2 hours ago' },
                  { action: 'Booking confirmed', user: 'Alex Morgan', time: '4 hours ago' },
                  { action: 'User registered', user: 'john@example.com', time: '1 day ago' },
                  { action: 'Payment received', user: 'Marcus Rivera', time: '2 days ago' },
                  { action: 'Track deleted', user: 'Admin', time: '3 days ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-text-secondary">by {activity.user}</div>
                    </div>
                    <div className="text-sm text-text-secondary">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tracks' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-xl font-bold">Track Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4">Track</th>
                    <th className="text-left p-4">Artist</th>
                    <th className="text-left p-4">Genre</th>
                    <th className="text-left p-4">Plays</th>
                    <th className="text-left p-4">Likes</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map(track => (
                    <tr key={track._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={track.coverArt}
                            alt={track.title}
                            className="w-10 h-10 rounded-lg mr-3"
                          />
                          <div>
                            <div className="font-medium">{track.title}</div>
                            <div className="text-sm text-text-secondary">{track.duration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{track.artist?.name || 'Unknown'}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {track.genre?.slice(0, 2).map(g => (
                            <span key={g} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">{track.plays || 0}</td>
                      <td className="p-4">{track.likes || 0}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          track.isFeatured
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {track.isFeatured ? 'Featured' : 'Published'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:text-primary transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:text-primary transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrack(track._id)}
                            className="p-2 hover:text-red-400 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-xl font-bold">Booking Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4">Package</th>
                    <th className="text-left p-4">Date & Time</th>
                    <th className="text-left p-4">Duration</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{booking.user?.name}</div>
                          <div className="text-sm text-text-secondary">{booking.user?.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize">{booking.packageType}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div>{new Date(booking.date).toLocaleDateString()}</div>
                          <div className="text-sm text-text-secondary">{booking.timeSlot}</div>
                        </div>
                      </td>
                      <td className="p-4">{booking.duration} hours</td>
                      <td className="p-4">${booking.totalPrice}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-xl font-bold">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Bookings</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-text-secondary">ID: {user._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                          user.role === 'artist' ? 'bg-primary/20 text-primary' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">{user.bookings?.length || 0}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:text-primary transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:text-red-400 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="fixed inset-4 md:inset-20 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="glass-effect rounded-3xl w-full max-w-4xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-heading text-2xl font-bold">Upload New Track</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:text-text-primary transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <TrackUploadForm
                    onSuccess={() => {
                      setShowUploadModal(false)
                      fetchDashboardData()
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard