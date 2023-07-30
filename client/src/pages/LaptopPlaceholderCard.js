import React from "react"
import ContentLoader from "react-content-loader"

const LaptopPlaceholderCard = (props) => (
  <ContentLoader 
    speed={2}
    width={850}
    height={250}
    viewBox="0 -10 850 250"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: '100%' }}
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="350" height="170" />
    <rect x="400" y="17" rx="3" ry="3" width="350" height="30" />
    <rect x="400" y="70" rx="3" ry="3" width="350" height="15" />
    <rect x="400" y="90" rx="3" ry="3" width="300" height="15" />
    <rect x="400" y="140" rx="3" ry="3" width="200" height="10" />
  
  </ContentLoader>
)

export default LaptopPlaceholderCard

