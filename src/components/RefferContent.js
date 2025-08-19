import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getRefferOfferContentApi } from "../services/allApi"
import { BASE_IMG_URL } from '../services/baseUrl'
import './RefferContent.css'

function RefferContent() {
    const { id } = useParams()
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Check if mobile on mount and on resize
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        
        checkIfMobile()
        window.addEventListener('resize', checkIfMobile)
        
        return () => window.removeEventListener('resize', checkIfMobile)
    }, [])

    useEffect(() => {
        const fetchRefferContent = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await getRefferOfferContentApi(id)
                
                // More robust response checking
                if (response?.status === 200 && response?.data?.data?.length > 0) {
                    setContent(response.data.data[0])
                } else {
                    setError("This content isn't available right now")
                }
            } catch (err) {
                console.error("Error fetching reffer content:", err)
                setError(err.response?.data?.message || 
                    "We couldn't load this content. Check your connection and try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchRefferContent()
    }, [id])

    const processedContent = useMemo(() => {
        if (!content) return null

        return {
            ...content,
            formattedDate: new Date(content.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            descriptionParagraphs: content.description.split('\n').filter(p => p.trim() !== '')
        }
    }, [content])

    // Custom error component with unique design
    const ErrorDisplay = ({ message }) => (
        <div className="error-art">
            <div className="error-art__canvas">
                <div className="error-art__shape error-art__shape--1"></div>
                <div className="error-art__shape error-art__shape--2"></div>
                <div className="error-art__shape error-art__shape--3"></div>
            </div>
            <div className="error-art__message">
                <h3>Oops!</h3>
                <p>{message}</p>
                <button 
                    className="error-art__retry"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="content-loader">
                <div className="content-loader__animation">
                    <div className="content-loader__dot"></div>
                    <div className="content-loader__dot"></div>
                    <div className="content-loader__dot"></div>
                </div>
                <p>Loading content...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="reffer-content-container">
                <ErrorDisplay message={error} />
            </div>
        )
    }

    if (!processedContent) {
        return (
            <div className="reffer-content-container">
                <div className="empty-state">
                    <div className="empty-state__illustration">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#F4F4F4" d="M40,-74.4C50.4,-66.8,56.6,-53.2,64.8,-40.3C73,-27.4,83.2,-15.2,83.7,-0.5C84.2,14.2,75,28.4,64.1,41.8C53.2,55.2,40.6,67.8,25.5,73.6C10.4,79.4,-7.2,78.4,-22.3,72.1C-37.4,65.8,-50,54.2,-60.2,40.7C-70.4,27.2,-78.2,11.6,-77.9,-3.9C-77.6,-19.5,-69.2,-39,-57.1,-53.8C-45,-68.6,-29.2,-78.7,-13.9,-73.9C1.4,-69.1,15.7,-49.4,25.9,-35.2C36.1,-21,42.2,-12.3,47.2,-1.7C52.2,8.9,56.1,20.4,52.9,30.4C49.7,40.4,39.4,48.9,28.1,55.5C16.8,62.1,4.4,66.8,-8.4,71.9C-21.2,77,-34.4,82.5,-45.9,77.3C-57.4,72.1,-67.2,56.2,-72.9,39.3C-78.6,22.4,-80.2,4.5,-76.8,-12.1C-73.4,-28.8,-65,-44.3,-52.9,-56.1C-40.8,-67.9,-25,-76,-9.4,-74.5C6.2,-73,12.4,-61.9,22.5,-52.7C32.6,-43.5,46.6,-36.2,56.3,-26.3C66,-16.4,71.4,-3.9,70.9,8.8C70.4,21.5,63.9,34.3,54.5,45.1C45.1,56,32.8,64.9,18.8,70.8C4.8,76.7,-10.9,79.5,-23.6,75.1C-36.3,70.6,-46,58.9,-56.7,46.7C-67.4,34.5,-79.1,21.8,-83.1,6.9C-87.1,-8.1,-83.4,-25.2,-74.5,-39.4C-65.6,-53.6,-51.5,-64.8,-36.7,-70.1C-21.9,-75.4,-6.4,-74.7,8.4,-71.4C23.1,-68.1,46.2,-62.1,58.5,-50.7C70.8,-39.3,72.3,-22.5,75.3,-5.4C78.3,11.7,82.8,28.9,77.3,43.1C71.8,57.2,56.3,68.2,40.6,74.2C24.9,80.2,8.9,81.1,-5.8,82.6C-20.5,84.1,-41,86.1,-54.3,77.9C-67.6,69.6,-73.7,51,-77.5,33.4C-81.3,15.8,-82.8,-0.8,-77.4,-15.3C-72,-29.8,-59.7,-42.2,-46.9,-53.6C-34.1,-65,-20.8,-75.4,-5.2,-73.9C10.4,-72.4,20.8,-59.1,31.3,-47.8C41.8,-36.5,52.4,-27.3,60.3,-15.8C68.2,-4.3,73.4,9.5,72.2,23.1C71,36.7,63.4,50.1,52.5,60.3C41.6,70.5,27.4,77.5,12.4,80.9C-2.6,84.3,-18.4,84.1,-31.2,77.7C-44,71.3,-53.8,58.7,-62.8,45.3C-71.8,31.9,-80,17.9,-81.2,3.2C-82.4,-11.6,-76.6,-27.1,-67.6,-40.5C-58.6,-53.9,-46.4,-65.2,-32.7,-71.6C-19,-78,-3.8,-79.5,11.8,-75.8C27.4,-72.1,54.8,-63.2,67.3,-48.7C79.8,-34.2,77.4,-14.1,75.8,5.4C74.3,24.9,73.6,49.8,63.4,64.3C53.2,78.8,33.5,82.9,16.7,79.2C0,75.5,-13.9,64,-24.5,53.3C-35.1,42.6,-42.4,32.7,-50.8,22.8C-59.2,12.9,-68.7,3,-70.2,-8.1C-71.7,-19.2,-65.2,-31.4,-55.3,-41.6C-45.4,-51.8,-32.1,-60,-18.1,-66.1C-4.1,-72.2,10.6,-76.2,22.6,-71.8C34.6,-67.4,43.9,-54.6,51.7,-41.9C59.5,-29.2,65.8,-16.6,68.3,-2.7C70.8,11.2,69.5,26.4,62.9,39.2C56.3,52,44.4,62.4,30.8,68.3C17.2,74.2,1.9,75.6,-12.2,72.7C-26.3,69.8,-39.4,62.6,-49.9,52.6C-60.4,42.6,-68.3,29.8,-73.4,15.9C-78.5,2,-80.8,-13,-76.2,-26.3C-71.6,-39.6,-60.1,-51.2,-46.8,-60.2C-33.5,-69.2,-18.4,-75.6,-2.1,-75.3C14.2,-75,28.4,-68,40,-74.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <h3>Nothing to see here</h3>
                    <p>We couldn't find any content to display</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`reffer-content-container ${isMobile ? 'mobile-view' : ''}`}>
            <article className="reffer-content-card">
                <header className="reffer-content-header">
                    <h1 className="reffer-content-title">{processedContent.title}</h1>
                    <div className="reffer-content-meta">
                        <span className="reffer-content-date">
                            {processedContent.formattedDate}
                        </span>
                    </div>
                </header>

                <div className="reffer-content-image-wrapper">
                    <img 
                        src={`${BASE_IMG_URL}/uploads/${processedContent.image}`}
                        alt={processedContent.title || "Referral content"}
                        className="reffer-content-image"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `${BASE_IMG_URL}/placeholder-image.jpg`
                        }}
                    />
                </div>

                <div className="reffer-content-body">
                    <div className="reffer-content-description">
                        {processedContent.descriptionParagraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    )
}

export default React.memo(RefferContent)