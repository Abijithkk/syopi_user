import React, { useState, useEffect } from 'react';
import { getNotificationsApi } from '../services/allApi';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotificationsApi();
      setNotifications(response.data.notifications || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      // Here you would call your mark as read API
      // await markNotificationAsReadApi(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'offerOnProduct':
        return '🏷️';
      case 'offerOnCategory':
        return '🛍️';
      case 'updation':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'order':
        return 'Order Update';
      case 'offerOnProduct':
        return 'Product Offer';
      case 'offerOnCategory':
        return 'Category Offer';
      case 'updation':
        return 'System Update';
      default:
        return 'Notification';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    return notif.notificationType === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={fetchNotifications}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <style jsx>{`
        .notification-header {
          background: linear-gradient(135deg, #29b6ff 0%, #00a8ff 100%)
          color: white;
          border-radius: 15px 15px 0 0;
          padding: 20px;
          margin-bottom: 0;
        }
        
        .notification-card {
          border: none;
          border-radius: 0 0 15px 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .notification-item {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
          cursor: pointer;
        }
        
        .notification-item:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
        }
        
        .notification-item.unread {
          border-left-color: #00a8ff;
          background-color: #f0f8ff;
        }
        
        .notification-item.unread:hover {
          background-color: #e6f3ff;
        }
        
        .notification-icon {
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #29b6ff 0%, #00a8ff 100%)
          color: white;
          margin-right: 15px;
        }
        
        .notification-content {
          flex-grow: 1;
        }
        
        .notification-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .notification-message {
          color: #7f8c8d;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .notification-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        
        .notification-type {
          background: #e9ecef;
          color: #495057;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .notification-time {
          color: #6c757d;
          font-size: 0.75rem;
        }
        
        .filter-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }
        
        .unread-badge {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }
        
        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }
      `}</style>
      
      <div className="row">
        <div className="col-12">
          <div className="notification-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-1">🔔 Notifications</h3>
                <p className="mb-0 opacity-75">Stay updated with your latest activities</p>
              </div>
              {unreadCount > 0 && (
                <div className="unread-badge">
                  {unreadCount}
                </div>
              )}
            </div>
          </div>
          
          <div className="card notification-card">
            <div className="card-body p-0">
              {/* Filter Buttons */}
              <div className="p-3 border-bottom">
                <div className="filter-buttons">
                  <button 
                    className={`btn filter-btn ${filter === 'all' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    All ({notifications.length})
                  </button>
                  <button 
                    className={`btn filter-btn ${filter === 'unread' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button 
                    className={`btn filter-btn ${filter === 'order' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('order')}
                  >
                    Orders
                  </button>
                  <button 
                    className={`btn filter-btn ${filter === 'offerOnProduct' ? 'btn-primary active' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('offerOnProduct')}
                  >
                    Offers
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              {filteredNotifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <h5>No notifications found</h5>
                  <p>You're all caught up! New notifications will appear here.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredNotifications.map((notification, index) => (
                    <div 
                      key={notification._id || index}
                      className={`list-group-item notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                    >
                      <div className="d-flex align-items-start">
                        <div className="notification-icon">
                          {getNotificationIcon(notification.notificationType)}
                        </div>
                        
                        <div className="notification-content">
                          <div className="notification-title">
                            {notification.title}
                          </div>
                          <div className="notification-message">
                            {notification.message}
                          </div>
                          <div className="notification-meta">
                            <span className="notification-type">
                              {getNotificationTypeLabel(notification.notificationType)}
                            </span>
                            <span className="notification-time">
                              <i className="bi bi-clock me-1"></i>
                              {formatDate(notification.createdAt)}
                            </span>
                            {!notification.isRead && (
                              <span className="badge bg-primary">New</span>
                            )}
                          </div>
                        </div>
                        
                        {!notification.isRead && (
                          <div className="ms-auto">
                            <div className="bg-primary rounded-circle" style={{width: '8px', height: '8px'}}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;