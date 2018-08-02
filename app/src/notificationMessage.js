
export default function showNotification(parent = '#main',  message = '', title = 'Advertencia'){

  const parentElem = document.querySelector(parent)

  const notificationContainer = document.createElement('div')
  const notificationContent = document.createElement('div')
  const notificationTitle = document.createElement('h2')
  const notificationMessage = document.createElement('p')
  const notificationButton = document.createElement('button')
  
  // container styles
  notificationContainer.style.width = '100%'
  notificationContainer.style.padding = '1em'
  notificationContainer.style.position = 'fixed'
  notificationContainer.style.top = '-50%'
  notificationContainer.style.transition = 'all 0.3s ease-out'
  // notificationContainer.style.transition = 'opacity 0.6s'

  // content styles
  notificationContent.style.backgroundColor = '#fff'
  notificationContent.style.width = '40%'
  notificationContent.style.maxWidth = '500px'
  notificationContent.style.boxShadow = '0 3px 3px 2px #B8B8B8'
  notificationContent.style.marginLeft = '30%'
  notificationContent.style.padding = '0.5em'
  notificationContent.style.borderRadius = '0.3em'

  // title style
  notificationTitle.style.fontSize = '1.5em'
  notificationTitle.style.fontWeight = '200'

  // messsage style
  notificationMessage.style.fontWeight = '410'

  // button style
  notificationButton.style.marginLeft = '70%'
  notificationButton.style.padding = '1em'
  notificationButton.style.paddingLeft = '2em'
  notificationButton.style.paddingRight = '2em'
  notificationButton.style.backgroundColor = '#6bcae6'
  notificationButton.style.borderRadius = '0.4em'
  notificationButton.style.color = '#fff'
  notificationButton.style.cursor = 'pointer'

  notificationButton.onclick = ()=>{
    notificationContainer.style.opacity = '0'
    setTimeout(()=>{
      parentElem.removeChild(notificationContainer)
    },
    700
    )
  }

  // adding texts
  notificationTitle.innerText = title
  notificationMessage.innerText = message
  notificationButton.innerText = 'Ok'
  
  // adding childs
  notificationContent.appendChild(notificationTitle)
  notificationContent.appendChild(notificationMessage)
  notificationContent.appendChild(notificationButton)

  notificationContainer.appendChild(notificationContent)
  parentElem.appendChild(notificationContainer)

  //wait until is fully added to DOM to play transition
  setTimeout(()=>{
    notificationContainer.style.top = '5%'
  }, 500)

}