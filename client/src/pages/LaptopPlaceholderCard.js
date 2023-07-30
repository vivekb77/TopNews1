import React from "react"
import ContentLoader from "react-content-loader"

const LaptopPlaceholderCard = (props) => (
  <ContentLoader 
    speed={2}
    width={700}
    height={250}
    viewBox="0 -10 700 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: '100%' }}
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="350" height="170" />
    <rect x="380" y="0" rx="3" ry="3" width="320" height="50" />
    <rect x="380" y="75" rx="3" ry="3" width="320" height="15" />
    <rect x="380" y="95" rx="3" ry="3" width="270" height="15" />
    <rect x="380" y="140" rx="3" ry="3" width="220" height="10" />
  
  </ContentLoader>
)

export default LaptopPlaceholderCard

