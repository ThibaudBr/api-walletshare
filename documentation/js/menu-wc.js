'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">api-walletshare documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="todo.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>TODO
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ApiLandingPageModule.html" data-type="entity-link" >ApiLandingPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' : 'data-target="#xs-controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' :
                                            'id="xs-controllers-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                            <li class="link">
                                                <a href="controllers/ApiLandingPageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLandingPageController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' : 'data-target="#xs-injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' :
                                        'id="xs-injectables-links-module-ApiLandingPageModule-bbf6e2fdbadf70462409c49a9555e10e4c71731d76f1ab0cbfd5fb8a54f740292744cc3385a7f1adc67e8897e293f1eea504a5ec2fc905c48b39f1ee73ae595d"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLandingPageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLandingPageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ApiLogModule.html" data-type="entity-link" >ApiLogModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' : 'data-target="#xs-injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' :
                                        'id="xs-injectables-links-module-ApiLogModule-aa1e2793ee1b48f06e7d6b7aa76e905fad2b7ccb1dc01b4fd18d4df3214778d859533605b92478c084129ed970426a40ab3656d8922c91cca8d753f279d57f75"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ApiMailModule.html" data-type="entity-link" >ApiMailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' : 'data-target="#xs-controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' :
                                            'id="xs-controllers-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                            <li class="link">
                                                <a href="controllers/ApiMailController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiMailController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' : 'data-target="#xs-injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' :
                                        'id="xs-injectables-links-module-ApiMailModule-0dd29c4efa61ec3c0dccd0fa1fa3856e49cd667135528bd6b8b357ad4649d25e1477c5e51b316dc3eac368c9dfb3b2ae0be118adff5680effd49503560e221d5"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApiMailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiMailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' : 'data-target="#xs-controllers-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' :
                                            'id="xs-controllers-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' : 'data-target="#xs-injectables-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' :
                                        'id="xs-injectables-links-module-AppModule-440f94d70d0e974de5d0fc0450b409b5ea8db468770cdb3091858be8ad851c58d83826c9d660987299114fc6b156b0358eebc678d9074f0eea4397e8dc21cfcc"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppTestE2eModule.html" data-type="entity-link" >AppTestE2eModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' : 'data-target="#xs-controllers-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' :
                                            'id="xs-controllers-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' }>
                                            <li class="link">
                                                <a href="controllers/AppTestE2eController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' : 'data-target="#xs-injectables-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' :
                                        'id="xs-injectables-links-module-AppTestE2eModule-2950aa4c5cc2c76986c35395cc509516e52c78503394bba0b4d2e6e67fe7c37a01337a7826fc910ce44ad54d398e8f52e69f4e03690c4c5dd3d4f806879ab77d"' }>
                                        <li class="link">
                                            <a href="injectables/AppTestE2eService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' : 'data-target="#xs-controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' :
                                            'id="xs-controllers-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' : 'data-target="#xs-injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' :
                                        'id="xs-injectables-links-module-AuthModule-aba4d66c5e565c25fc55eab5459fc3c669ae6ae9e93c31b7d81a45d11eabe71aace6c556102a3ea337d48782f02c680baa95218b2ddcc5ea2eddff65b896e55d"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtRefreshTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CardModule.html" data-type="entity-link" >CardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' : 'data-target="#xs-controllers-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' :
                                            'id="xs-controllers-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' }>
                                            <li class="link">
                                                <a href="controllers/CardController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' : 'data-target="#xs-injectables-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' :
                                        'id="xs-injectables-links-module-CardModule-9bc1646ac61b85a2a4c11bd8ee2c3aaeaaea549db1ffbb2c23f4f624234f4f746256545662cfebf6b3cefccb3b93cc6e56d08527f42c03aa5acc87b5cd6c41f1"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EntitiesToMoveModule.html" data-type="entity-link" >EntitiesToMoveModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HealthCheckModule.html" data-type="entity-link" >HealthCheckModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'data-target="#xs-controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' :
                                            'id="xs-controllers-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                            <li class="link">
                                                <a href="controllers/HealthCheckController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthCheckController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' : 'data-target="#xs-injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' :
                                        'id="xs-injectables-links-module-HealthCheckModule-62ca7414f0374f6883490997c9072ff335a31d9485e072ec245e7738d89ae78230293f62468c8dc5b367b60f4950692f5b00edf2d7ce283f3b0bca69e20e2a72"' }>
                                        <li class="link">
                                            <a href="injectables/CustomHealthCheckService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomHealthCheckService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OccupationModule.html" data-type="entity-link" >OccupationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' : 'data-target="#xs-controllers-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' :
                                            'id="xs-controllers-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' }>
                                            <li class="link">
                                                <a href="controllers/OccupationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OccupationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' : 'data-target="#xs-injectables-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' :
                                        'id="xs-injectables-links-module-OccupationModule-3939b1667950aa91e01671a40777a99364c37dedb89b0b41734fcf03cefdf6291184864496baa1ce830a48c8be89c8b82154d0d1ca19529dc2eb1ec8688a7037"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OccupationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OccupationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' : 'data-target="#xs-controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' :
                                            'id="xs-controllers-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' : 'data-target="#xs-injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' :
                                        'id="xs-injectables-links-module-ProfileModule-872d74d9624e2cac4a215def7500e8ac03f2e1c94077fb2382297ded738327d1ff34e6439825081e0da662d7edd46bd27a48bcacafa7108fe07806d8720433be"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SocialNetworkModule.html" data-type="entity-link" >SocialNetworkModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' : 'data-target="#xs-controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' :
                                            'id="xs-controllers-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                            <li class="link">
                                                <a href="controllers/SocialNetworkController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialNetworkController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' : 'data-target="#xs-injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' :
                                        'id="xs-injectables-links-module-SocialNetworkModule-25203634ad7286393192da3c204e1c87d452ee78a781f94537775bfbe4228aa9ecb8fbf5475fd2f3ce1de2f48252163429827c75e821ba3a0cd7ca892ffc6519"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SocialNetworkService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialNetworkService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' : 'data-target="#xs-controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' :
                                            'id="xs-controllers-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' : 'data-target="#xs-injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' :
                                        'id="xs-injectables-links-module-UserModule-598f8ac0640a10d79ef9fe11422ae19c3061ac5efdacb01dbf21867b7226ac2d132e94a52639ac72221b4a10f551647bcce4b4d7a78b2a61d42adaa5b7d1b486"' }>
                                        <li class="link">
                                            <a href="injectables/ApiLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/AddressEntity.html" data-type="entity-link" >AddressEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CardEntity.html" data-type="entity-link" >CardEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CompanyEmployeeEntity.html" data-type="entity-link" >CompanyEmployeeEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CompanyEntity.html" data-type="entity-link" >CompanyEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ConnectedCardEntity.html" data-type="entity-link" >ConnectedCardEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ConversationEntity.html" data-type="entity-link" >ConversationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DiscountCodeEntity.html" data-type="entity-link" >DiscountCodeEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GroupEntity.html" data-type="entity-link" >GroupEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GroupMembershipEntity.html" data-type="entity-link" >GroupMembershipEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/InvoicesEntity.html" data-type="entity-link" >InvoicesEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/JoinedConversation.html" data-type="entity-link" >JoinedConversation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/MediaEntity.html" data-type="entity-link" >MediaEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/MessageEntity.html" data-type="entity-link" >MessageEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/NotificationEntity.html" data-type="entity-link" >NotificationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OccupationEntity.html" data-type="entity-link" >OccupationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PlanEntity.html" data-type="entity-link" >PlanEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProfileEntity.html" data-type="entity-link" >ProfileEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ReferralCodeEntity.html" data-type="entity-link" >ReferralCodeEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SocialNetworkEntity.html" data-type="entity-link" >SocialNetworkEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/StripEventEntity.html" data-type="entity-link" >StripEventEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SubscriptionEntity.html" data-type="entity-link" >SubscriptionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddConnectedCardCommand.html" data-type="entity-link" >AddConnectedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardCommandHandler.html" data-type="entity-link" >AddConnectedCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardEvent.html" data-type="entity-link" >AddConnectedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardEventHandler.html" data-type="entity-link" >AddConnectedCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddConnectedCardRequest.html" data-type="entity-link" >AddConnectedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardCommand.html" data-type="entity-link" >AddSavedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardCommandHandler.html" data-type="entity-link" >AddSavedCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardEvent.html" data-type="entity-link" >AddSavedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardEventHandler.html" data-type="entity-link" >AddSavedCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSavedCardRequest.html" data-type="entity-link" >AddSavedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardCommand.html" data-type="entity-link" >AddViewCountCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardCommandHandler.html" data-type="entity-link" >AddViewCountCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardEvent.html" data-type="entity-link" >AddViewCountCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddViewCountCardEventHandler.html" data-type="entity-link" >AddViewCountCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardDto.html" data-type="entity-link" >CardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardResponse.html" data-type="entity-link" >CardResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommandErrorException.html" data-type="entity-link" >CommandErrorException</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardCommand.html" data-type="entity-link" >CreateCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardCommandHandler.html" data-type="entity-link" >CreateCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardEvent.html" data-type="entity-link" >CreateCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardEventHandler.html" data-type="entity-link" >CreateCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardRequest.html" data-type="entity-link" >CreateCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogCommand.html" data-type="entity-link" >CreateLogCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogCommandHandler.html" data-type="entity-link" >CreateLogCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogDto.html" data-type="entity-link" >CreateLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMethodLogDto.html" data-type="entity-link" >CreateMethodLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationCommand.html" data-type="entity-link" >CreateOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationCommandHandler.html" data-type="entity-link" >CreateOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationDto.html" data-type="entity-link" >CreateOccupationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationEvent.html" data-type="entity-link" >CreateOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationEventHandler.html" data-type="entity-link" >CreateOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOccupationRequest.html" data-type="entity-link" >CreateOccupationRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileCommand.html" data-type="entity-link" >CreateProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileCommandHandler.html" data-type="entity-link" >CreateProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link" >CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileEvent.html" data-type="entity-link" >CreateProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileEventHandler.html" data-type="entity-link" >CreateProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileRequest.html" data-type="entity-link" >CreateProfileRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkCommand.html" data-type="entity-link" >CreateSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkCommandHandler.html" data-type="entity-link" >CreateSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkEvent.html" data-type="entity-link" >CreateSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkEventHandler.html" data-type="entity-link" >CreateSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSocialNetworkRequest.html" data-type="entity-link" >CreateSocialNetworkRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserCommand.html" data-type="entity-link" >CreateUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserCommandHandler.html" data-type="entity-link" >CreateUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserEvent.html" data-type="entity-link" >CreateUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserEventHandler.html" data-type="entity-link" >CreateUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserResponse.html" data-type="entity-link" >CreateUserResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardCommand.html" data-type="entity-link" >DeleteCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardCommandHandler.html" data-type="entity-link" >DeleteCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardEvent.html" data-type="entity-link" >DeleteCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteCardEventHandler.html" data-type="entity-link" >DeleteCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailCommand.html" data-type="entity-link" >DeleteMailCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailCommandHandler.html" data-type="entity-link" >DeleteMailCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailEvent.html" data-type="entity-link" >DeleteMailEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteMailEventHandler.html" data-type="entity-link" >DeleteMailEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationCommand.html" data-type="entity-link" >DeleteOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationCommandHandler.html" data-type="entity-link" >DeleteOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationEvent.html" data-type="entity-link" >DeleteOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteOccupationEventHandler.html" data-type="entity-link" >DeleteOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileCommand.html" data-type="entity-link" >DeleteProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileCommandHandler.html" data-type="entity-link" >DeleteProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileEvent.html" data-type="entity-link" >DeleteProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteProfileEventHandler.html" data-type="entity-link" >DeleteProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkCommand.html" data-type="entity-link" >DeleteSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkCommandHandler.html" data-type="entity-link" >DeleteSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkEvent.html" data-type="entity-link" >DeleteSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteSocialNetworkEventHandler.html" data-type="entity-link" >DeleteSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserCommand.html" data-type="entity-link" >DeleteUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserCommandHandler.html" data-type="entity-link" >DeleteUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserEvent.html" data-type="entity-link" >DeleteUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserEventHandler.html" data-type="entity-link" >DeleteUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateMailException.html" data-type="entity-link" >DuplicateMailException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateNameException.html" data-type="entity-link" >DuplicateNameException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateUsernameException.html" data-type="entity-link" >DuplicateUsernameException</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityCreationException.html" data-type="entity-link" >EntityCreationException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCustomEvent.html" data-type="entity-link" >ErrorCustomEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCustomEventHandler.html" data-type="entity-link" >ErrorCustomEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorExceptionFilter.html" data-type="entity-link" >ErrorExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateUserDto.html" data-type="entity-link" >GenerateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardQuery.html" data-type="entity-link" >GetAllCardQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardQueryHandler.html" data-type="entity-link" >GetAllCardQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithProfileIdQuery.html" data-type="entity-link" >GetAllCardWithProfileIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithProfileIdQueryHandler.html" data-type="entity-link" >GetAllCardWithProfileIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithUserIdQuery.html" data-type="entity-link" >GetAllCardWithUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllCardWithUserIdQueryHandler.html" data-type="entity-link" >GetAllCardWithUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllMailQuery.html" data-type="entity-link" >GetAllMailQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllMailQueryHandler.html" data-type="entity-link" >GetAllMailQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllOccupationQuery.html" data-type="entity-link" >GetAllOccupationQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllOccupationQueryHandler.html" data-type="entity-link" >GetAllOccupationQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllProfileQuery.html" data-type="entity-link" >GetAllProfileQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllProfileQueryHandler.html" data-type="entity-link" >GetAllProfileQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllSocialNetworkQuery.html" data-type="entity-link" >GetAllSocialNetworkQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllSocialNetworkQueryHandler.html" data-type="entity-link" >GetAllSocialNetworkQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardByIdQuery.html" data-type="entity-link" >GetCardByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardByIdQueryHandler.html" data-type="entity-link" >GetCardByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardWithCriteriaQuery.html" data-type="entity-link" >GetCardWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardWithCriteriaQueryHandler.html" data-type="entity-link" >GetCardWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCardWithCriteriaRequest.html" data-type="entity-link" >GetCardWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationByIdQuery.html" data-type="entity-link" >GetOccupationByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationByIdQueryHandler.html" data-type="entity-link" >GetOccupationByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaDto.html" data-type="entity-link" >GetOccupationWithCriteriaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaQuery.html" data-type="entity-link" >GetOccupationWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaQueryHandler.html" data-type="entity-link" >GetOccupationWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOccupationWithCriteriaRequest.html" data-type="entity-link" >GetOccupationWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileByIdQuery.html" data-type="entity-link" >GetProfileByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileByIdQueryHandler.html" data-type="entity-link" >GetProfileByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesByUserIdQuery.html" data-type="entity-link" >GetProfilesByUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesByUserIdQueryHandler.html" data-type="entity-link" >GetProfilesByUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfilesWithCriteriaRequest.html" data-type="entity-link" >GetProfilesWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileWithCriteriaDto.html" data-type="entity-link" >GetProfileWithCriteriaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileWithCriteriaQuery.html" data-type="entity-link" >GetProfileWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProfileWithCriteriaQueryHandler.html" data-type="entity-link" >GetProfileWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithProfileIdQuery.html" data-type="entity-link" >GetSavedCardWithProfileIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithProfileIdQueryHandler.html" data-type="entity-link" >GetSavedCardWithProfileIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithUserIdQuery.html" data-type="entity-link" >GetSavedCardWithUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSavedCardWithUserIdQueryHandler.html" data-type="entity-link" >GetSavedCardWithUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkByIdQuery.html" data-type="entity-link" >GetSocialNetworkByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkByIdQueryHandler.html" data-type="entity-link" >GetSocialNetworkByIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkWithCriteriaQuery.html" data-type="entity-link" >GetSocialNetworkWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkWithCriteriaQueryHandler.html" data-type="entity-link" >GetSocialNetworkWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSocialNetworkWithCriteriaRequest.html" data-type="entity-link" >GetSocialNetworkWithCriteriaRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByEmailQuery.html" data-type="entity-link" >GetUserByEmailQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByEmailQueryHandler.html" data-type="entity-link" >GetUserByEmailQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByUsernameQuery.html" data-type="entity-link" >GetUserByUsernameQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByUsernameQueryHandler.html" data-type="entity-link" >GetUserByUsernameQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserIfRefreshTokenMatchesQuery.html" data-type="entity-link" >GetUserIfRefreshTokenMatchesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserIfRefreshTokenMatchesQueryHandler.html" data-type="entity-link" >GetUserIfRefreshTokenMatchesQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserLoginQuery.html" data-type="entity-link" >GetUserLoginQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserLoginQueryHandler.html" data-type="entity-link" >GetUserLoginQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserQuery.html" data-type="entity-link" >GetUserQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserQueryHandler.html" data-type="entity-link" >GetUserQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserWithCriteriaDto.html" data-type="entity-link" >GetUserWithCriteriaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserWithCriteriaQuery.html" data-type="entity-link" >GetUserWithCriteriaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserWithCriteriaQueryHandler.html" data-type="entity-link" >GetUserWithCriteriaQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupMembershipResponse.html" data-type="entity-link" >GroupMembershipResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/HealthCheckQuery.html" data-type="entity-link" >HealthCheckQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/HealthCheckQueryHandler.html" data-type="entity-link" >HealthCheckQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/HealthCheckResponse.html" data-type="entity-link" >HealthCheckResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdProfileDto.html" data-type="entity-link" >IdProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidIdException.html" data-type="entity-link" >InvalidIdException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidMailException.html" data-type="entity-link" >InvalidMailException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidParameterEntityException.html" data-type="entity-link" >InvalidParameterEntityException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidPasswordException.html" data-type="entity-link" >InvalidPasswordException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidUsernameException.html" data-type="entity-link" >InvalidUsernameException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsCardOwnerWithUserIdQuery.html" data-type="entity-link" >IsCardOwnerWithUserIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsCardOwnerWithUserIdQueryHandler.html" data-type="entity-link" >IsCardOwnerWithUserIdQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsProfileOwnerWithUserIsQuery.html" data-type="entity-link" >IsProfileOwnerWithUserIsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsProfileOwnerWithUserIsQueryHandler.html" data-type="entity-link" >IsProfileOwnerWithUserIsQueryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsTestEnvironmentPipe.html" data-type="entity-link" >IsTestEnvironmentPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListRolesDto.html" data-type="entity-link" >ListRolesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggingTypeEnum.html" data-type="entity-link" >LoggingTypeEnum</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginOfUserEvent.html" data-type="entity-link" >LoginOfUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginOfUserEventHandler.html" data-type="entity-link" >LoginOfUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailDto.html" data-type="entity-link" >MailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailLandingPageDto.html" data-type="entity-link" >MailLandingPageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailRequiredException.html" data-type="entity-link" >MailRequiredException</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailResponse.html" data-type="entity-link" >MailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotTheOwnerException.html" data-type="entity-link" >NotTheOwnerException</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoUserTraceException.html" data-type="entity-link" >NoUserTraceException</a>
                            </li>
                            <li class="link">
                                <a href="classes/OccupationDto.html" data-type="entity-link" >OccupationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OccupationNotFoundException.html" data-type="entity-link" >OccupationNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/OccupationResponse.html" data-type="entity-link" >OccupationResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileResponse.html" data-type="entity-link" >ProfileResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryErrorException.html" data-type="entity-link" >QueryErrorException</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterCommand.html" data-type="entity-link" >RegisterCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterEvent.html" data-type="entity-link" >RegisterEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterEventHandler.html" data-type="entity-link" >RegisterEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterHandler.html" data-type="entity-link" >RegisterHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardCommand.html" data-type="entity-link" >RemoveConnectedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardCommandHandler.html" data-type="entity-link" >RemoveConnectedCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardEvent.html" data-type="entity-link" >RemoveConnectedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardEventHandler.html" data-type="entity-link" >RemoveConnectedCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveConnectedCardRequest.html" data-type="entity-link" >RemoveConnectedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenCommand.html" data-type="entity-link" >RemoveRefreshTokenCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenCommandHandler.html" data-type="entity-link" >RemoveRefreshTokenCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenEvent.html" data-type="entity-link" >RemoveRefreshTokenEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveRefreshTokenEventHandler.html" data-type="entity-link" >RemoveRefreshTokenEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveSavedCardCommand.html" data-type="entity-link" >RemoveSavedCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveSavedCardEvent.html" data-type="entity-link" >RemoveSavedCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveSavedCardRequest.html" data-type="entity-link" >RemoveSavedCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardCommand.html" data-type="entity-link" >RestoreCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardCommandHandler.html" data-type="entity-link" >RestoreCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardEvent.html" data-type="entity-link" >RestoreCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreCardEventHandler.html" data-type="entity-link" >RestoreCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationCommand.html" data-type="entity-link" >RestoreOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationCommandHandler.html" data-type="entity-link" >RestoreOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationEvent.html" data-type="entity-link" >RestoreOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreOccupationEventHandler.html" data-type="entity-link" >RestoreOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileCommand.html" data-type="entity-link" >RestoreProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileCommandHandler.html" data-type="entity-link" >RestoreProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileEvent.html" data-type="entity-link" >RestoreProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreProfileEventHandler.html" data-type="entity-link" >RestoreProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkCommand.html" data-type="entity-link" >RestoreSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkCommandHandler.html" data-type="entity-link" >RestoreSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkEvent.html" data-type="entity-link" >RestoreSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreSocialNetworkEventHandler.html" data-type="entity-link" >RestoreSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserCommand.html" data-type="entity-link" >RestoreUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserCommandHandler.html" data-type="entity-link" >RestoreUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserEvent.html" data-type="entity-link" >RestoreUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreUserEventHandler.html" data-type="entity-link" >RestoreUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGroupMembershipEnum.html" data-type="entity-link" >RoleGroupMembershipEnum</a>
                            </li>
                            <li class="link">
                                <a href="classes/SamePasswordException.html" data-type="entity-link" >SamePasswordException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailCommand.html" data-type="entity-link" >SendMailCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailCommandHandler.html" data-type="entity-link" >SendMailCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailEvent.html" data-type="entity-link" >SendMailEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMailEventHandler.html" data-type="entity-link" >SendMailEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenCommand.html" data-type="entity-link" >SetCurrentRefreshTokenCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenCommandHandler.html" data-type="entity-link" >SetCurrentRefreshTokenCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenEvent.html" data-type="entity-link" >SetCurrentRefreshTokenEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentRefreshTokenEventHandler.html" data-type="entity-link" >SetCurrentRefreshTokenEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerCommand.html" data-type="entity-link" >ShiftProfileOwnerCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerCommandHandler.html" data-type="entity-link" >ShiftProfileOwnerCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerEvent.html" data-type="entity-link" >ShiftProfileOwnerEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerEventHandler.html" data-type="entity-link" >ShiftProfileOwnerEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftProfileOwnerRequest.html" data-type="entity-link" >ShiftProfileOwnerRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialNetworkDto.html" data-type="entity-link" >SocialNetworkDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialNetworkResponse.html" data-type="entity-link" >SocialNetworkResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardCommand.html" data-type="entity-link" >SoftDeleteCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardCommandHandler.html" data-type="entity-link" >SoftDeleteCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardEvent.html" data-type="entity-link" >SoftDeleteCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteCardEventHandler.html" data-type="entity-link" >SoftDeleteCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationCommand.html" data-type="entity-link" >SoftDeleteOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationCommandHandler.html" data-type="entity-link" >SoftDeleteOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationEvent.html" data-type="entity-link" >SoftDeleteOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteOccupationEventHandler.html" data-type="entity-link" >SoftDeleteOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileCommand.html" data-type="entity-link" >SoftDeleteProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileCommandHandler.html" data-type="entity-link" >SoftDeleteProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileEvent.html" data-type="entity-link" >SoftDeleteProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteProfileEventHandler.html" data-type="entity-link" >SoftDeleteProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkCommand.html" data-type="entity-link" >SoftDeleteSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkCommandHandler.html" data-type="entity-link" >SoftDeleteSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkEvent.html" data-type="entity-link" >SoftDeleteSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteSocialNetworkEventHandler.html" data-type="entity-link" >SoftDeleteSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserCommand.html" data-type="entity-link" >SoftDeleteUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserCommandHandler.html" data-type="entity-link" >SoftDeleteUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserEvent.html" data-type="entity-link" >SoftDeleteUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteUserEventHandler.html" data-type="entity-link" >SoftDeleteUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimestampEntityExtendEntity.html" data-type="entity-link" >TimestampEntityExtendEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferProfileToUserCommand.html" data-type="entity-link" >TransferProfileToUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedRequestException.html" data-type="entity-link" >UnauthorizedRequestException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardCommand.html" data-type="entity-link" >UpdateCardCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardCommandHandler.html" data-type="entity-link" >UpdateCardCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardEvent.html" data-type="entity-link" >UpdateCardEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardEventHandler.html" data-type="entity-link" >UpdateCardEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardRequest.html" data-type="entity-link" >UpdateCardRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationCommand.html" data-type="entity-link" >UpdateOccupationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationCommandHandler.html" data-type="entity-link" >UpdateOccupationCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationDto.html" data-type="entity-link" >UpdateOccupationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationEvent.html" data-type="entity-link" >UpdateOccupationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationEventHandler.html" data-type="entity-link" >UpdateOccupationEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationRequest.html" data-type="entity-link" >UpdateOccupationRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileCommand.html" data-type="entity-link" >UpdateOccupationsProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileCommandHandler.html" data-type="entity-link" >UpdateOccupationsProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileDto.html" data-type="entity-link" >UpdateOccupationsProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileEvent.html" data-type="entity-link" >UpdateOccupationsProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOccupationsProfileEventHandler.html" data-type="entity-link" >UpdateOccupationsProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileCommand.html" data-type="entity-link" >UpdateProfileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileCommandHandler.html" data-type="entity-link" >UpdateProfileCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileEvent.html" data-type="entity-link" >UpdateProfileEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileEventHandler.html" data-type="entity-link" >UpdateProfileEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileRequest.html" data-type="entity-link" >UpdateProfileRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkCommand.html" data-type="entity-link" >UpdateSocialNetworkCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkCommandHandler.html" data-type="entity-link" >UpdateSocialNetworkCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkEvent.html" data-type="entity-link" >UpdateSocialNetworkEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkEventHandler.html" data-type="entity-link" >UpdateSocialNetworkEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSocialNetworkRequest.html" data-type="entity-link" >UpdateSocialNetworkRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommand.html" data-type="entity-link" >UpdateUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommandHandler.html" data-type="entity-link" >UpdateUserCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialCommand.html" data-type="entity-link" >UpdateUserCredentialCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialCommandHandler.html" data-type="entity-link" >UpdateUserCredentialCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialDto.html" data-type="entity-link" >UpdateUserCredentialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialEvent.html" data-type="entity-link" >UpdateUserCredentialEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCredentialEventHandler.html" data-type="entity-link" >UpdateUserCredentialEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserEvent.html" data-type="entity-link" >UpdateUserEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserEventHandler.html" data-type="entity-link" >UpdateUserEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleCommand.html" data-type="entity-link" >UpdateUserRoleCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleCommandHandler.html" data-type="entity-link" >UpdateUserRoleCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleEvent.html" data-type="entity-link" >UpdateUserRoleEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserRoleEventHandler.html" data-type="entity-link" >UpdateUserRoleEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserListResponse.html" data-type="entity-link" >UserListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLoginDto.html" data-type="entity-link" >UserLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLoginResponse.html" data-type="entity-link" >UserLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotFoundException.html" data-type="entity-link" >UserNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DatabaseConfiguration.html" data-type="entity-link" >DatabaseConfiguration</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorLoggingMiddleware.html" data-type="entity-link" >ErrorLoggingMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthenticationGuard.html" data-type="entity-link" >JwtAuthenticationGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshGuard.html" data-type="entity-link" >JwtRefreshGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthenticationGuard.html" data-type="entity-link" >LocalAuthenticationGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestLoggingMiddleware.html" data-type="entity-link" >RequestLoggingMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponseLoggingMiddleware.html" data-type="entity-link" >ResponseLoggingMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/RequestUser.html" data-type="entity-link" >RequestUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenPayload.html" data-type="entity-link" >TokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserIdDto.html" data-type="entity-link" >UserIdDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});