var timeFx = function (fx: any) {

    return function (
        action: any,
        props: any) {

        return [
            fx,
            {
                action: action,
                delay: props.delay
            }
        ];
    };
};

export var timeout = timeFx(

    function (
        dispatch: any,
        props: any) {

        setTimeout(
            function () {

                dispatch(props.action);
            },
            props.delay
        );
    }
);

export var interval = timeFx(

    function (
        dispatch: any,
        props: any) {

        var id = setInterval(
            function () {
                
                dispatch(
                    props.action,
                    Date.now()
                );
            },
            props.delay
        );

        return function () {

            clearInterval(id);
        };
    }
);


// export var now
// export var retry
// export var debounce
// export var throttle
// export var idleCallback?
