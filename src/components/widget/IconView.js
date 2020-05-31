import React from 'react';
import './IconView.css';

export default class IconView extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            containerWidth: 300,  
            containerHeight: 300, 
            itemWidth: 90,  
            itemHeight: 85,   
            items: [
                {
                    id: '1',       
                    text: 'Item 1',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '2',       
                    text: 'Item 2',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '3',       
                    text: 'Item 3',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '4',       
                    text: 'Item name so lang, that it must be truncated',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '5',       
                    text: 'Item 5',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '6',       
                    text: 'Item 6',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '7',       
                    text: 'Item 7',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '8',       
                    text: 'Item 8',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '9',       
                    text: 'Item 9',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '10',       
                    text: 'Item 10',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '11',       
                    text: 'Item 11',       
                    img: 'logo192.png',       
                    checked: false 
                },
                {
                    id: '12',       
                    text: 'Item 12',       
                    img: 'logo192.png',       
                    checked: false 
                }
            ],
            settings: {
                className: "icon-view",
                pageSize: 15 // How many items will be "generated"
            },
            isLoading: false,
            hasNext: true,
            maxAddedId: 1000, // for addItems testing
            maxItems: 50
        };

        this.callbackItemCheck = this.callbackItemCheck.bind(this);
    }

    addItems(itemsToAdd)
    {
        this.setState(state => {
            const items = state.items.concat(itemsToAdd);
       
            return {
                items
            };
        });
    }

    removeItems(itemIds)
    {
        this.setState(state => {
            const items = state.items.filter(item => !itemIds.includes(item.id));
       
            return {
                items
            };
        });
    }

    checkItems(itemIds)
    {
        this.setState(state => {
            const items = state.items.map(item => {
                if (itemIds.includes(item.id)) {
                    item.checked = true;
                }
                return item;
            });

            return {
                items
            }
        });
    }

    uncheckItems(itemIds)
    {
        this.setState(state => {
            const items = state.items.map(item => {
                if (itemIds.includes(item.id)) {
                    item.checked = false;
                }
                return item;
            });

            return {
                items
            }
        });
    }

    /**
     * Toggles selection on items - uncheck if any item checked, or else check all
     */
    toggleItemsCheck()
    {
        let checkedItemsIds = [];
        let uncheckedItemsIds = [];

        for (const key in this.state.items) {
            if (this.state.items[key].checked) {
                checkedItemsIds.push(this.state.items[key].id);
            } else {
                uncheckedItemsIds.push(this.state.items[key].id);
            }
        }

        if (checkedItemsIds.length > 0) {
            this.uncheckItems(checkedItemsIds);
        } else {
            this.checkItems(uncheckedItemsIds);
        }
    }

    /**
     * Get array of checked items ids and call removeItems on it
     */
    removeCheckedItems()
    {
        let checkedItemsIds = this.state.items.map(item => {
            if (item.checked) {
                return item.id;
            }
        });

        this.removeItems(checkedItemsIds);
    }

    /**
     * Callback called by Icon component after checking or unchecking item.
     * 
     * @param {string} itemId 
     * @param {bool} checkedState 
     */
    callbackItemCheck(itemId, checkedState)
    {
        if (checkedState) {
            this.checkItems([itemId]);
        } else {
            this.uncheckItems([itemId]);
        }
    }

    render()
    {
        return (
            <React.Fragment>
                <div
                style={{
                    width: this.state.containerWidth
                }}>
                    <button
                    onClick={() => this.removeCheckedItems()}>
                        Удалить
                    </button>
                    <button
                    onClick={() => this.toggleItemsCheck()}>
                        Выделить/Сбросить
                    </button>
                </div>
                <div
                className={this.getCssClassName()}
                style={{
                    width: this.state.containerWidth,
                    height: this.state.containerHeight
                }}
                onScroll={(e) => this.onScroll(e)}>
                    {this.getItemsView()}
                </div>
                <div
                style={{
                    width: this.state.containerWidth
                }}>
                    <button
                    onClick={() => this.addItems(this.getNewItems(this.state.settings.pageSize))}>
                        addItems
                    </button>
                </div>
            </React.Fragment>
        );
    }

    /**
     * Returns array of Icon components - one for each item in state
     */
    getItemsView()
    {
        let result = [];

        if (!this.state.isLoading && this.state.items.length > 0) {
            result = this.state.items.map(item => {
                return (
                    <Icon 
                    key={item.id} 
                    item={item} 
                    itemWidth={this.state.itemWidth}
                    itemHeight={this.state.itemHeight}
                    cssClass={this.getCssClassName()} 
                    callback={this.callbackItemCheck} />
                );
            });
        }

        return result;
    }

    getCssClassName()
    {
        return this.state.settings.className;
    }

    /**
     * Scroll event handler for items container. Adds items after reaching bottom of the scroll.
     * 
     * @param {object} e 
     */
    onScroll(e)
    {
        const scrolledToBottom = e.target.offsetHeight + e.target.scrollTop === e.target.scrollHeight;
        
        if (scrolledToBottom) {
            this.addItems(this.getNewItems(this.state.settings.pageSize))
        }
    }

    /**
     * Returns array of *count* items if available
     * 
     * @param {int} count 
     */
    getNewItems(count)
    {
        let result = [];

        if (!this.state.isLoading && this.state.hasNext) {
            let maxAddedId = this.state.maxAddedId;
            let hasNext = true;

            for (let index = 0; index < count; index++) {
                if ((this.state.items.length + result.length) < this.state.maxItems) {
                    result.push({
                        id: '' + maxAddedId,       
                        text: 'Item ' + maxAddedId,       
                        img: 'logo192.png',       
                        checked: false 
                    });
                    
                    maxAddedId++;
                } else {
                    hasNext = false;
                    break;
                }
                
            }

            this.setState({
                hasNext: hasNext,
                maxAddedId: maxAddedId
            });
        }
        

        return result;
    }
}
 
class Icon extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = props.item;

        this.toggleCheck = this.toggleCheck.bind(this);
    }

    toggleCheck()
    {
        this.props.callback(this.props.item.id, !this.props.item.checked);
    }

    render()
    {
        return (
            <div 
            className={
                this.props.cssClass + "__item" + (this.props.item.checked ?  " checked" : "")
            }
            style={{
                width: this.props.itemWidth,
                height: this.props.itemHeight
            }}
            onClick={this.toggleCheck}>
                <div className={this.props.cssClass + "__image"}>
                    <img src={this.props.item.img}/>
                </div>
                <div className={this.props.cssClass + "__text"}>
                    <span>{this.props.item.text}</span>
                </div>
            </div>
        );
    }
}