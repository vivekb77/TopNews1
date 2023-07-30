import React from "react"
import ContentLoader from "react-content-loader"
// https://skeletonreact.com/

const LaptopPlaceholderCard = (props) => (
  <ContentLoader 
    speed={2}
    width={400}
    height={330}
    viewBox="0 0 400 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: '100%' }}
    {...props}
  >
    <rect x="15" y="0" rx="5" ry="5" width="370" height="170" />
    <rect x="15" y="200" rx="3" ry="3" width="370" height="30" />
    <rect x="15" y="240" rx="3" ry="3" width="370" height="15" />
    <rect x="15" y="270" rx="3" ry="3" width="200" height="15" />
    <rect x="15" y="300" rx="3" ry="3" width="100" height="10" />
  
  </ContentLoader>
)

export default LaptopPlaceholderCard

