import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, courses: []}

  componentDidMount() {
    this.getCourses()
  }

  getCourses = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch('https://apis.ccbp.in/te/courses')

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.courses.map(eachObj => ({
        id: eachObj.id,
        name: eachObj.name,
        logoUrl: eachObj.logo_url,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        courses: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-cont">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="fail-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="fail-pic"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.getCourses} className="butt" type="button">
        Retry
      </button>
    </div>
  )

  renderCourses = () => {
    const {courses} = this.state

    return (
      <div className="courses-cont">
        <h1>Courses</h1>
        <ul className="courses-list">
          {courses.map(eachObj => (
            <li className="course-item" key={eachObj.id}>
              <Link className="link" to={`/courses/${eachObj.id}`}>
                <img
                  src={eachObj.logoUrl}
                  alt={eachObj.name}
                  className="c-logo"
                />
                <p className="c-para">{eachObj.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderCourses()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-cont">
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default Home
