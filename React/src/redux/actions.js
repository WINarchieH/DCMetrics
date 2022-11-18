import { SET_USER , SET_NAVBAR, SET_SITES, SET_SITE, SET_DATA } from './actionTypes';

export const setUser = username => ({
    type: SET_USER,
    body: { username }
});

export const setNavbar = navbar => ({
    type: SET_NAVBAR,
    body: { navbar }
});

export const setSites = sites => ({
    type: SET_SITES,
    body: { sites }
});

export const setSite = site => ({
    type: SET_SITE,
    body: { site }
});

export const setData = data => ({
    type: SET_DATA,
    body: {data}
});