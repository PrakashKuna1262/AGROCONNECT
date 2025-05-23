import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Send, Package, AlertCircle, Loader } from 'lucide-react';
import './ProducerComments.css';

const ProducerComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Get the user's email from localStorage
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          throw new Error('You need to be logged in to view comments');
        }

        const userData = JSON.parse(userDataString);
        const email = userData.email;

        console.log('Fetching comments for producer:', email);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get-comments?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data = await response.json();
        console.log('Comments data:', data);
        setComments(data.messages || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleCardClick = (index) => {
    setSelectedComment(selectedComment === index ? null : index);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="loading-icon" size={40} />
        <p>Loading your comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle className="error-icon" size={40} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="comments-container">
      <div className="comments-header">
        <MessageCircle className="header-icon" />
        <h2>Your Comments</h2>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <MessageCircle size={32} />
            <p>No comments found for your products.</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className={`comment-card ${selectedComment === index ? 'expanded' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="comment-header">
                <div className="product-badge">
                  <Package size={16} />
                  <span>{comment.product_name}</span>
                </div>
                <div className="email-preview">{comment.Consumer_mail}</div>
              </div>

              <div className="comment-details">
                <div className="detail-row">
                  <User size={16} />
                  <span>From:</span>
                  <span className="detail-value">{comment.Consumer_mail}</span>
                </div>

                <div className="detail-row">
                  <Send size={16} />
                  <span>To:</span>
                  <span className="detail-value">{comment.Producer_mail}</span>
                </div>

                <div className="detail-row">
                  <Package size={16} />
                  <span>Product:</span>
                  <span className="detail-value">{comment.product_name}</span>
                </div>

                <div className="message-content">
                  <span className="message-label">Message:</span>
                  <p>{comment.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProducerComments;