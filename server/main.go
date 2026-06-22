package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "./dist"
	}

	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())

	// Content API. New content endpoints (e.g. an Open5e spell proxy) hang off this group.
	// CORS is scoped here rather than globally since the static SPA assets don't need it.
	api := e.Group("/api", middleware.CORS("*"))
	contentCache := cacheControl(time.Hour)
	api.GET("/races", racesHandler, contentCache)
	api.GET("/classes", classesHandler, contentCache)
	api.GET("/armor", armorHandler, contentCache)
	api.POST("/calculate", calculateHandler)
	api.GET("/spells", spellsHandler, contentCache)
	api.GET("/extended/:category", extendedHandler, contentCache)

	// Serve the built SPA, falling back to index.html for client-side routes
	// (Vue Router history mode). API paths skip this so the router handles them.
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  staticDir,
		Index: "index.html",
		HTML5: true,
		Skipper: func(c *echo.Context) bool {
			return strings.HasPrefix(c.Request().URL.Path, "/api/")
		},
	}))

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	sc := echo.StartConfig{
		Address: ":" + port,
		// Echo's default Start() already sets ReadTimeout (covers slow-header/slow-body
		// clients); WriteTimeout has no default, so a slow client could otherwise hold a
		// response open indefinitely.
		BeforeServeFunc: func(s *http.Server) error {
			s.WriteTimeout = 30 * time.Second
			return nil
		},
	}

	log.Printf("listening on http://localhost:%s (static: %s)", port, staticDir)
	if err := sc.Start(ctx, e); err != nil {
		log.Fatal(err)
	}
}
