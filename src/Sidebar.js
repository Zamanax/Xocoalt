import React from 'react';
import { Drawer, IconButton, ListItem, ListItemIcon, ListItemText, Divider, List} from "@material-ui/core"
import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from '@material-ui/icons/BarChart';
import MapIcon from '@material-ui/icons/Map';

class Sidebar extends React.Component {

	handleDrawerClose() {
		
	}

    render() {
        return (<Drawer
          variant="permanent"
        >
          <div>
            <IconButton onClick={this.handleDrawerClose}>
            </IconButton>
          </div>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
				  <ListItemIcon> <HomeIcon/> </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        )
    }
}

export default Sidebar;
