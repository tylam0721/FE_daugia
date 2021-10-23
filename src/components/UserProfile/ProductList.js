import React, { useState, useEffect } from "react";
import { Grid, Menu, Segment, Item, Divider , Icon} from "semantic-ui-react";
import "./UserProfile.css";
import axios from "axios";
import { API_HOST, API_HOST_DEV } from "../../config/endpoints";
import { useStateValue } from "../../StateProvider/StateProvider";
import { useHistory, Redirect } from "react-router-dom";