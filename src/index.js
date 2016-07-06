function buildTile(url, interval = 60000) {
    if (!url || !interval)
        throw new Error('missing argument', url, interval)
    // DOM Element
    /**
     * ul
     *   li
     *     div(class="base")
     *       img
     *       div(class="control")
     *         button(class="delete-tile")
     *         input
     *         button(class="update-tile")
     */
    const ul = document.getElementById('mainTiles')
    ul.style['list-style'] = 'none'
    const li = document.createElement('li')
    ul.appendChild(li)
    const base = document.createElement('div')
    base.style.width = '300px'
    base.style.height = '200px'
    base.style['background-color'] = 'blue'
    base.style.display = 'flex'
    base.style['flex-direction'] = 'column'
    li.appendChild(base)
    const img = document.createElement('img')
    img.style.flex = 1
    img.style.width = '100%'
    img.style.height = 'auto'
    img.style.overflow = 'hidden'
    base.appendChild(img)
    const control = document.createElement('div')
    control.style['flex-shrink'] = 0
    control.style.display = 'flex'
    base.appendChild(control)
    const remove = document.createElement('button')
    remove.textContent = '-'
    control.appendChild(remove)
    const input = document.createElement('input')
    input.style['flex-grow'] = 1
    control.appendChild(input)
    const update = document.createElement('button')
    update.textContent = '+'
    control.appendChild(update)
    // Update Text
    input.value = url
    // Get Image
    img.src = `/search/${url}`
    // Events
    update.onclick = function() {
        updateTile.call(this)
    }
    remove.onclick = function() {
        removeTile.call(this)
    }
}

function updateTile() {
    const tile = this.closest('li')
    const input = tile.querySelector('input').value
    const img = tile.querySelector('img')
    const forceNewImage = new Date().getTime()
    img.src = '/search/' + input + '?timestamp=' + forceNewImage
}

function removeTile() {
    const tile = this.closest('li')
    tile.parentNode.removeChild(tile)
}

// subbing is a bit weird atm...
const events = (function(){
    let tiles = {}
    return {
        subscribe,
        publish
    }
    function subscribe(url, listener) {
        // create url if it doesn't exist
        if(!tiles.hasOwnProperty.call(tiles, url))
            tiles[url] = []
        const index = tiles[url].push(listener) - 1
        // callback for tile removal
        return {
            remove: function(){
                console.log('removing', tiles[url][index])
                delete tiles[url][index]
            }
        }
    }
    function publish(url, info) {
        //
        tiles[url].forEach(function(item) {
            item(info || {})
        })
    }
})()

events.subscribe('add', function(obj) {
    buildTile(obj.url)
})

// buildTile('google.com', 60000)

const mainInput = document.querySelector('#mainInput')
mainInput.value = 'news.ycombinator.com'
const mainButton = document.querySelector('#addUrl')
mainButton.addEventListener('click', () => {
    events.publish('add', {url: mainInput.value})
})
