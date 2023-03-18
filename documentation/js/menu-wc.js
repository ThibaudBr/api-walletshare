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
                                            'data-target="#controllers-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' : 'data-target="#xs-controllers-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' :
                                            'id="xs-controllers-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' : 'data-target="#xs-injectables-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' :
                                        'id="xs-injectables-links-module-AppModule-21f22dd625a7ca9bcad655eff8bb3fa1f336f3b980b23eeb7ca257b9b13a21a6f00378c0d99cfbb384124bf2e0e5fc4ff7fff50f6f4d79c7e3d83866933b2571"' }>
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
                                            'data-target="#controllers-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' : 'data-target="#xs-controllers-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' :
                                            'id="xs-controllers-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' }>
                                            <li class="link">
                                                <a href="controllers/AppTestE2eController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppTestE2eController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' : 'data-target="#xs-injectables-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' :
                                        'id="xs-injectables-links-module-AppTestE2eModule-62ea4984ba79ad350b073695248acf1e607acb5b6a852061b2474eff375ae717ef0f317bd4aa4853d3cafc95a07dabb94cc453ae3f5bb28fa8188a83d182b900"' }>
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
                                            'data-target="#controllers-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' : 'data-target="#xs-controllers-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' :
                                            'id="xs-controllers-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' : 'data-target="#xs-injectables-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' :
                                        'id="xs-injectables-links-module-AuthModule-016837dd668f2e4048c5ce7a9b03d859b9b672e2c1859920e5230c7f8739c6e70a05938dc749e71eb9fb3add871684f4f2edd7d3b1051a1444cfc077cd0d6466"' }>
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
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' : 'data-target="#xs-controllers-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' :
                                            'id="xs-controllers-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' : 'data-target="#xs-injectables-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' :
                                        'id="xs-injectables-links-module-UserModule-7732d5318450c79f22e84f92b52235aa43af39c3d5409a92886d87aa98956affb8d2a499d7b01415712357b35f9b5a5c49f063ac07b4288206b646374828a223"' }>
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
                                <a href="classes/DuplicateEmailException.html" data-type="entity-link" >DuplicateEmailException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DuplicateUsernameException.html" data-type="entity-link" >DuplicateUsernameException</a>
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
                                <a href="classes/GetAllMailQuery.html" data-type="entity-link" >GetAllMailQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllMailQueryHandler.html" data-type="entity-link" >GetAllMailQueryHandler</a>
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
                                <a href="classes/GetUserHandler.html" data-type="entity-link" >GetUserHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserIfRefreshTokenMatchesHandler.html" data-type="entity-link" >GetUserIfRefreshTokenMatchesHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserIfRefreshTokenMatchesQuery.html" data-type="entity-link" >GetUserIfRefreshTokenMatchesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserLoginHandler.html" data-type="entity-link" >GetUserLoginHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserLoginQuery.html" data-type="entity-link" >GetUserLoginQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserQuery.html" data-type="entity-link" >GetUserQuery</a>
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
                                <a href="classes/InvalidParameterEntityException.html" data-type="entity-link" >InvalidParameterEntityException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidPasswordException.html" data-type="entity-link" >InvalidPasswordException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsTestEnvironmentPipe.html" data-type="entity-link" >IsTestEnvironmentPipe</a>
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
                                <a href="classes/MailResponse.html" data-type="entity-link" >MailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoUserTraceException.html" data-type="entity-link" >NoUserTraceException</a>
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
                                <a href="classes/RoleGroupMembershipEnum.html" data-type="entity-link" >RoleGroupMembershipEnum</a>
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
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimestampEntityExtendEntity.html" data-type="entity-link" >TimestampEntityExtendEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedRequestException.html" data-type="entity-link" >UnauthorizedRequestException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommand.html" data-type="entity-link" >UpdateUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommandHandler.html" data-type="entity-link" >UpdateUserCommandHandler</a>
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