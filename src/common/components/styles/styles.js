const styles = {
  imageStyle: {
    width: 201.9,
    height: 56.8,
    resizeMode: 'cover'
  },
  buttonStyle: {
    backgroundColor: "#F7FAFC",
    height: 48,
    marginTop: 10,
    width: '95%',
    marginLeft: 10,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  buttonTitleStyle: {
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#212529',
  },
  buttonLinkStyle: {
    backgroundColor: "#FFFFFFFF",
    height: 48,
    marginTop: 10,
  },
  buttonLinkTitleStyle: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: '400',
    color: '#000000',
    opacity: 0.5,
    textDecorationLine: 'underline',
  },
  rowStyle: {
    height: 50,
    paddingTop: 20,
    borderBottomColor: '#616161',
    borderBottomWidth: 0.5
  },
  rowStyleMedium: {
    height: 75,
    paddingTop: 20,
    borderBottomColor: '#616161',
    borderBottomWidth: 0.5
  },
  rowStyleWider: {
    height: 100,
    paddingTop: 20,
    borderBottomColor: '#616161',
    borderBottomWidth: 0.5
  },
  titleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#212121',
    fontFamily: 'OpenSans-Bold',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'OpenSans-Bold',
  },
  regularText: {
    fontSize: 11,
    color: '#212529',
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    opacity: 0.5,
  },
  headerStyle:{
    marginTop: 30,
    marginBottom: 30
  },
  headerTitleText: {
    marginLeft: 20,
    fontSize: 11,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'OpenSans-Bold',
  },
  h1Text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'OpenSans-Bold',
  },
  h1TextMargin: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'OpenSans-Bold',
  },
  h1TextColor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D2C64',
    fontFamily: 'OpenSans-Bold',
  },
  gridStyle: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 500
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
  center_view: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  right_view: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  center_view_with_bottom: {
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  table: {
    head:{
      borderWidth: 1,
      borderColor: '#EAEDED',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D0D0D0',
    },
    col: {
      borderWidth: 1,
      borderColor: '#EAEDED',
      justifyContent: 'center',
      alignItems: 'center',
    },
    regular_text: {
      fontSize: 11,
      color: '#212529',
      opacity: 0.5,
      textAlign: 'justify'
    },
    title_text:{
      fontFamily: 'OpenSans-Bold',
      fontSize: 11,
      fontWeight: '700',
      color: '#212529',
    }
  },
  button_group: {
    default: {
      backgroundColor: '#FFFFFF',
    },
    selected: {
      backgroundColor: '#EAEDED',
    },
    text: {
      fontFamily: 'OpenSans-Bold',
      color: '#212529',
      fontSize: 11,
    },
    inner_border: {
      color: '#EAEDED',
    },
    container: {
      marginTop: 10,
      borderColor: '#EAEDED',
      borderWidth: 2,
      height: 40,
      borderRadius: 8,
    }
  },
  title: {
    color: '#000000',
    opacity: 0.5,
    fontFamily: 'OpenSans-SemiBold',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    label: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 14,
      color: '#000000',
      fontWeight: '400',
      opacity: 0.5,
    },
  },
  button: {
    big: {
      backgroundColor: "#172B4C",
      height: 48,
      width: 343,
    },
    small: {
      backgroundColor: "#172B4C",
      height: 43,
    },
    small_light: {
      backgroundColor: "#EAEDED",
      height: 43,
      width: 209,
    },
    add_items: {
      backgroundColor: "#EAEDED",
      height: 43,
    },
    toggle: {
      backgroundColor: "#FFFFFF",
      height: 48,
      marginRight: 20,
    },
    title: {
      fontFamily: 'OpenSans-Bold',
      fontWeight: '700',
      fontSize: 14,
    },
    title_light: {
      fontFamily: 'OpenSans-Bold',
      fontWeight: '700',
      fontSize: 14,
      color: '#212529',
    },
    rounded_blue_container: {
      borderRadius: 5,
      borderColor: '#172B4C',
      borderWidth: 1,
    },
    rounded_blue: {
      padding: 5,
      backgroundColor: '#FFFFFF',
    },
    rounded_yellow_container: {
      borderRadius: 5,
    },
    rounded_yellow: {
      padding: 5,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: '#FFC944',
    },
    rounded_yellow_title: {
      fontSize: 12,
      fontFamily: 'OpenSans-Bold',
      fontWeight: '700',
      color: '#FFFFFF'
    },
    rounded_title: {
      fontSize: 11,
      fontFamily: 'OpenSans-Bold',
      fontWeight: '700',
      color: '#212529'
    }
  },
  radio: {
    circle_active_color: '#FCBD2E',
    circle_inactive_color: '#757575',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'cover'
  },
  icon_big: {
    width: 100,
    height: 100,
    resizeMode: 'cover'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  chart: {
    flex: 1
  },


};

export default styles;
